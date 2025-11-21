# Invoice Generation Examples

## Example 1: Monthly Invoice with Salary Only

```bash
npm run generate -- generate \
  --salary 100 \
  --month November \
  --output november_invoice.pdf
```

## Example 2: Monthly Invoice with Salary + Bonus

```bash
npm run generate -- generate \
  --salary 100 \
  --bonus 100 \
  --month November \
  --output november_bonus_invoice.pdf
```

## Example 3: Invoice with Reimbursements

```bash
npm run generate -- generate \
  --salary 100 \
  --reimbursement "Travel Expenses:Zwroty kosztów podróży:50" \
  --reimbursement "Equipment Purchase:Zakup sprzętu:75" \
  --month November \
  --output november_reimbursement_invoice.pdf
```

## Example 4: Complete Invoice (All Items)

```bash
npm run generate -- generate \
  --salary 100 \
  --bonus 100 \
  --reimbursement "Travel Expenses:Zwroty kosztów:50" \
  --month November \
  --output november_complete_invoice.pdf
```

## Example 5: Custom Date and Currency

```bash
npm run generate -- generate \
  --salary 1000 \
  --bonus 500 \
  --currency EUR \
  --date 2025-12-01 \
  --month December \
  --output december_eur_invoice.pdf
```

## What Gets Generated

Each command creates two files:
1. **PDF Invoice** (e.g., `november_invoice.pdf`)
   - Page 1: English version
   - Page 2: Polish version

2. **Email Template** (e.g., `november_invoice_email.txt`)
   - Subject line: "Name Surname November Invoice for Service"
   - Formatted email body with StashAway signature

## Next Steps

1. Edit `config.json` with your real details
2. Run one of the commands above
3. Send the generated PDF as an email attachment with the template text
