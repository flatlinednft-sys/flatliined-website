import { NextResponse } from "next/server"
import ExcelJS from "exceljs"
import fs from "fs"
import path from "path"

const filePath = path.join(process.cwd(), "whitelist.xlsx")

// simple in-memory mutex so concurrent requests don't clobber each other's writes
let writeQueue: Promise<any> = Promise.resolve()

async function appendAddress(address: string, source: string) {
  const workbook = new ExcelJS.Workbook()
  let worksheet: ExcelJS.Worksheet

  if (fs.existsSync(filePath)) {
    await workbook.xlsx.readFile(filePath)
    worksheet = workbook.getWorksheet("Whitelist") || workbook.worksheets[0]
  } else {
    worksheet = workbook.addWorksheet("Whitelist")
    worksheet.addRow(["Address", "Source", "Timestamp"])
  }

  // check duplicates by scanning column A directly (array-based, no key mapping needed)
  let exists = false
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return
    const cell = row.getCell(1).value
    if (cell && cell.toString().trim().toLowerCase() === address) {
      exists = true
    }
  })

  if (!exists) {
    worksheet.addRow([address, source, new Date().toISOString()])
    await workbook.xlsx.writeFile(filePath)
  }

  return !exists
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)
    if (!body || !body.address) {
      return NextResponse.json({ error: "Missing address" }, { status: 400 })
    }

    const { address, source } = body
    const normalizedAddress = address.trim().toLowerCase()

    if (!/^0x[a-fA-F0-9]{40}$/.test(normalizedAddress)) {
      return NextResponse.json({ error: "Invalid Ethereum address" }, { status: 400 })
    }

    // chain onto the queue, but ALWAYS leave the queue in a resolved state
    // (never let a rejection poison future requests)
    const task = writeQueue.then(
      () => appendAddress(normalizedAddress, source || "manual"),
      () => appendAddress(normalizedAddress, source || "manual") // prior request failed — still run this one
    )
    writeQueue = task.catch(() => undefined) // queue continuation is always "resolved"

    const added = await task // but the actual caller still sees the real result/error

    return NextResponse.json({ success: true, added, address: normalizedAddress }, { status: 200 })
  } catch (error: any) {
    console.error("[WHITELIST EXCEL WRITE ERROR]:", error)

    const locked = error?.code === "EBUSY" || error?.code === "EPERM" || /lock|busy|permission/i.test(error?.message || "")

    return NextResponse.json(
      {
        error: locked
          ? "whitelist.xlsx is currently open/locked. Close it in Excel and try again."
          : "Failed to update Excel file.",
      },
      { status: 500 }
    )
  }
}