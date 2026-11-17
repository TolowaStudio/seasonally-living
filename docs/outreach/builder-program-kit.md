# Builder program kit (TOL-2904)

**Status: DRAFT. Not approved. Nothing here has been sent, printed or shown to a builder.** Goal: builders are the second most credible growth line, 4 accounts now to 8 by summer. Builders are also the biggest pool-consult source (8 of 20), so a builder account is worth more than its own sales.

Every `[[...]]` is a number or fact only Susan can fill in. Nothing goes to a builder until Susan has approved the terms and Jeramey has approved the copy. The site's `/builders` page already promises "trade terms" and a "quarterly update, four emails a year"; this kit is what stands behind that promise.

## 1. Trade terms (for Susan to approve)

| Term | Proposal | Susan decides |
| --- | --- | --- |
| Payment | Net 30 from invoice for approved trade accounts. New accounts: deposit on first order, net 30 from the second. | [[Net 30 OK? Credit limit per account?]] |
| Volume tier | Two tiers on trade price, by purchases in a calendar year. Tier 1: every approved account. Tier 2: after [[$ threshold]] in a year. | [[Tier 1 and Tier 2 trade price: % off list, per line]] |
| Priority stock holds | A builder can put stock on hold for [[14]] days against a signed job, ahead of walk-in customers. One extension with the job schedule. | [[Hold length; deposit to hold?]] |
| Install | Our crew installs on the builder's schedule, quoted per job. Venting is quoted with the appliance, not after. | [[Install rates for trade]] |
| Warranty and returns | Manufacturer warranty passes through. Special orders are not returnable. | [[Confirm]] |
| Exclusions | Spas and swim spas are quoted per job, not on the tiers, unless Susan says otherwise. | [[Confirm]] |
| Application | One page: business name, license number, contact, a trade reference, where the work is. | [[Resale or contractor license needed?]] |

Rules for the copy that goes out: no price or percentage appears in the one-page sheet or the email. Trade pricing is quoted by Susan to an approved account only.

## 2. One-page builder sheet (print or PDF, front only)

Plain, one side. Susan approves the terms line before it prints.

```text
SEASONALLY LIVING, FOR BUILDERS AND REMODELERS
Fire and water for the houses you build. One local crew since 1979.

WHAT WE CARRY
- Wood stoves and inserts: Stuv, Kuma, Morso
- Gas and electric fireplaces and inserts: Napoleon
- Venting: one of the largest selections in the region, on the shelf
- Hot tubs and swim spas: Cal Spas

INSTALL SUPPORT
Our crew installs the appliance and the venting on your schedule.
We do the site check, the venting design and the permit.
You get one contact and one invoice, not three trades to coordinate.

KIMBERLY ANSWERS
Call (509) 667-8833. Kimberly picks up, knows your jobs, and gets you
a real answer on stock, lead times and install dates, not a callback queue.

VENTING, BUNDLED RIGHT THE FIRST TIME
The appliance and its venting are sized and quoted together, so the
inspector sees the right parts and the job does not wait on a second order.

TRADE TERMS
Net 30 for approved accounts. Volume tier pricing. Priority stock holds
against signed jobs. [[Susan to approve this line]]

SERVING Wenatchee, Chelan, Leavenworth and the valley.
Showroom: 1407 Maiden Ln, Wenatchee, WA 98801
Apply: seasonallyliving.com/builders
```

## 3. Target list: 8 builders and remodelers

4 existing accounts plus 4 new. Names stay out of the repo (business data does not live in a code repo): keep the list in the CRM as `seasonallyLivingBuilderAccount` records (`docs/crm/source-standard.md`) and tag new leads `BUILDER`. This table is the shape to fill.

| # | Status | Area | Target type | Owner | Next step |
| --- | --- | --- | --- | --- | --- |
| 1 to 4 | Existing | [[per account]] | [[builder or remodeler]] | Susan | Confirm terms, ask for next-job list |
| 5 | New | Chelan | Custom home builder | Susan | Visit with the sheet |
| 6 | New | Leavenworth | Custom or chalet builder | Susan | Visit with the sheet |
| 7 | New | Wenatchee or East Wenatchee | Remodeler (hearth swaps) | Susan | Intro call, then showroom visit |
| 8 | New | [[Cashmere, Entiat or Manson]] | Spec or second-home builder (spas, rentals) | Susan | Intro call |

Pick the names from builders who already come to the counter, pool-build contacts (`seasonallyLivingPoolBuild`) and permits in Chelan and Leavenworth. Every contact is a business contact the owners know; no cold list buying. Progress is counted as approved accounts, target 8 by summer.

## 4. Quarterly builder email (its own segment)

Four a year, to builder accounts and builder leads only. This is a separate segment from Cam's wave emails and from the monthly note: a builder never gets the consumer waves, and consumers never get this. Anyone can unsubscribe in one click. Plain text, signed by Susan or Cam.

Link tags: use `utm_source=builder` so the site records `BUILDER` (`docs/crm/source-standard.md`). Do not use `utm_campaign=wave-...` here, that tags `LIST_WAVE`.

Subject: [[Season]] update for builders: what is in stock and what is coming

```text
{{first_name}},

Here is the quarter at Seasonally Living, short.

IN STOCK AND LEAD TIMES
- [[Stoves and inserts: what is on the floor, what is a special order, weeks]]
- [[Venting: anything short or newly stocked]]
- [[Hot tubs and swim spas: lead time]]

WHAT IS NEW
- [[One new product or change, and who it suits]]

ON JOBS AROUND THE VALLEY
- [[One short, real job note: what was installed, what made it go smoothly]]

FOR YOUR NEXT JOB
If you have a job coming in the next [[quarter]], send me the address and the plans and we will hold stock and book the crew. Kimberly can answer stock and dates today at (509) 667-8833.

Susan

--
Seasonally Living by Chim Chimney
1407 Maiden Ln, Wenatchee, WA 98801 | (509) 667-8833
Builders and trade: https://seasonallyliving.com/builders?utm_source=builder&utm_medium=email&utm_campaign=builder-quarterly
Stop these emails: {{unsubscribe_url}}
```

## 5. Pool-consult tracking

Builders sent 8 of 20 pool consults. When a builder refers a consult, log it with source `BUILDER` and the builder's name, so the count by builder is visible each quarter and the best referrers get the first call about holds and lead times.

## Open questions for Susan

1. Terms table: every `[[...]]` in section 1.
2. Names for the 4 existing accounts, and the 4 new targets she wants first.
3. Does she want the quarterly email signed by her or by Cam?
