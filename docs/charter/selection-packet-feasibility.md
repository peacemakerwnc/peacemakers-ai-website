# Charter selection packets: two ways to make the PDFs

**Internal note for James.** 14 October 2026. Not for Charter. No prototype was built.

Charter’s designer writes selections in the meeting, then records them on an Excel sheet in the HLRL9017 style. From that sheet we want four PDFs: a Charter-branded client packet, a designer palette, a paint packet, and an electrician packet that shows only his work. Buildertrend entry stays a person typing it in. No new heavy subscription.

This A/B is the delivery tool (a script on her PC, or a small web form). On 6 October the words “Option A / Option B” meant something else: worksheets first, and Buildertrend automation later. Both prices below leave Buildertrend alone.

## What this rests on

From the 6 October meeting notes (client-reported; not checked against a file): notes go from handwriting to Excel, then a client review, then a ChatGPT visual, then someone types a summary into Buildertrend. The office price list carries a client price and an electrician price. For the client copy, someone copies lines onto a job sheet and deletes columns by hand. Buildertrend is described as holding a marked-up plan PDF and a total, not the line items. We still do not have the real tile sheet, paint sheet, photo library, or electrical price list. No HLRL9017 file was opened for this note.

The palette in this price is a laid-out page of her choices and photos. A new ChatGPT image step is a separate decision, and it is outside both prices.

## Option A — a script on her Windows PC ($9,500, about 43.5 hours)

**Feasible: yes. Confidence: high, about 8 out of 10, once the sheet layout is frozen.** Reading rows, keeping the right price column, placing a photo, and writing a PDF is ordinary scripting. Confidence drops if each job’s workbook is arranged differently. That is still unknown.

**Photos.** Pasting pictures into Excel is not a reliable way to feed the packets. A normal paste floats on top of the grid (Excel’s “Place over Cells”). The image bytes are stored in the file, but the room they belong to is a floating anchor, and that anchor moves when a row is inserted. The common Python reader, openpyxl, sees only some of those floating pictures, and it does not see Microsoft’s newer in-cell pictures at all.

Use a folder of ordinary image files beside the workbook, one file per section, with fixed names such as `kitchen-backsplash.jpg` and `exterior-paint.jpg`. She saves or drops the photo there. The script matches the name to the section and reuses it on the client packet and the palette. A missing name prints “photo not included” on that section.

Place in Cell (a named cell in a locked template) is a fallback only if she insists the photo live inside the sheet, and only after we confirm Microsoft 365 or Excel 2024. Microsoft documents that feature for those products; Excel 2021 and older do not have it. That fallback is extra work and sits outside the 43.5 hours.

**What she installs and clicks.** Copy one folder onto her PC and run a one-time setup so Windows can run the script. She buys nothing. An unsigned .exe will trip SmartScreen, so ship the script and a desktop shortcut instead. Her ongoing steps: finish the sheet as she does now, drop photos in the job folder, double-click “Make Charter packets,” and choose the workbook if asked. Four PDFs save beside the spreadsheet.

**Where it runs, and monthly cost.** Her PC only. No server. Software cost is $0 a month. The sheet and the PDFs should live in whatever folder the office already backs up. Which backup they use is unknown.

**Risks.** The first inserted column will break a script that expects last month’s layout. The electrician filter needs a Trade column; guessing from words like “outlet” will mis-file fixtures. Wrong photo filenames will happen; the PDF should leave a blank rather than show the wrong room. A new computer means copying the folder again. Two layout reviews on a real job fit these hours. An open-ended redesign does not.

**Hours and price.** Hold $9,500 and about 43.5 hours for one template taken from a real sheet, the photo folder, four PDFs, and no Buildertrend work. The exterior/ARC packet discussed on 6 October is not in this price. Do not spend the hours on reading freeform pasted pictures.

## Option B — a small web form ($15,000, about 69 hours)

**Feasible: yes. Confidence: about 8 out of 10 that the app can be built for this price, and about 6 out of 10 that she will want it during a client meeting.** Dropdowns, saved jobs, and PDFs are straightforward. The open question is habit. She already has the sheet in front of the client.

**Photos.** One file button per section. The picture is stored with that job and reused on every packet that needs it. This is reliable. Nothing is read back out of Excel.

**What she installs and clicks.** Nothing to install. A bookmark. She opens a saved job or starts one, picks lines from dropdowns filled by the price-list spreadsheet, attaches one photo per section, clicks Save, then Make PDFs, and downloads the same four files. You set her password. The electrician does not get a login. He gets a PDF.

**Where it runs, and monthly cost.** A small server you control, with the job files and a nightly backup on that machine. Planning estimate: about $6–15 a month for the server and a simple web address. That is an estimate, not a host’s quote. No Adobe, Airtable, Zapier, or Buildertrend add-on. If the model home has no workable internet, a hosted form is the wrong tool in the meeting. That has not been checked.

**Risks.** You own uptime, backups, and password resets. Replacing the price-list spreadsheet when costs change is simple, and it will become a support habit. Weak wifi makes photo upload painful. The form will be slower than Excel in the first month. The way this passes 69 hours is a second login for the electrician, or any attempt to type into Buildertrend.

**Hours and price.** Hold $15,000 and about 69 hours inside this fence: one user, price lists swapped as a spreadsheet, four PDFs, no offline mode, no second login, no Buildertrend. Live support is outside the fixed price. Plan on a separate hour or so a month, or bill small fixes as they come. Raising the build price to hide that support would blur the quote.

## Recommendation

Offer Option A. She keeps the spreadsheet she already uses in the meeting, and one shortcut writes the four PDFs. You can fix it on her PC without a server. Use the photo folder. Hold $9,500. Tell her that pictures pasted into Excel will not drive the packets.

Keep Option B for later. Offer it if, after a few real jobs on A, she says the sheet itself is the bottleneck: cost columns left on the client copy, or standard choices that are painful to reopen. Build the web app only after that shows up.

Before either number goes into a client document, get one real job workbook and one paint sheet. If those sheets are not one stable layout, reprice A before starting.

## Sources

- Meeting notes, 6 October 2026: https://notes.granola.ai/d/ebb402fb-9174-4f87-b08b-642121f2a608
- Microsoft, Place in Cell: https://support.microsoft.com/en-us/excel/insert-picture-in-cell-in-excel
- openpyxl image support (insert path; in-cell pictures are a known gap for `worksheet._images`): https://openpyxl.readthedocs.io/en/stable/images.html
