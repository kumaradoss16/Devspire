# Semantic, Patient Universe, HCP Universe, Hypothesis and Feature Agents – Explained with a Real-World Example

In your Healthcare Agentic NBA (Next Best Action) project, these five agents help transform raw healthcare data into meaningful business opportunities and measurable features.

The overall business objective is:

Right Doctor + Right Patient + Right Product + Right Time + Right Channel.

Let's use one consistent example throughout the explanation:

Example business scenario: A pharmaceutical company wants to identify psychiatrists who may be relevant for its MDD (Major Depressive Disorder) treatment, Rexulti, and understand the patient-treatment patterns that could support an appropriate next-best-action strategy.

## 1. Semantic Agent – Understands the healthcare data

First: Understand the data

### What is the purpose?

The Semantic Agent helps the system understand what the available database tables and columns represent from a healthcare business perspective.

A Snowflake database might contain hundreds of tables and thousands of columns. The agent needs to understand which tables contain patient diagnoses, prescriptions, healthcare professionals, products and other relevant information.

Think of the Semantic Agent as a translator between technical database structures and healthcare business terminology.

### Example

Suppose your Snowflake database contains these tables:

| Physical table | Example columns                          | Business meaning                |
| -------------- | ---------------------------------------- | ------------------------------- |
| `PATIENT_DIM`  | PATIENT_ID, DOB, GENDER                  | Patient demographic information |
| `CLAIMS_DX`    | PATIENT_ID, DIAGNOSIS_CODE, SERVICE_DATE | Patient diagnosis records       |
| `CLAIMS_RX`    | PATIENT_ID, PRODUCT_ID, RX_DATE          | Prescription records            |
| `HCP_DIM`      | HCP_ID, SPECIALTY                        | Doctor information              |
| `PRODUCT_DIM`  | PRODUCT_ID, PRODUCT_NAME                 | Pharmaceutical product details  |

A business user might ask:

"Find patients diagnosed with Major Depressive Disorder."

The system needs to understand:

- Which physical table contains diagnosis information?
- Which column identifies the diagnosis?
- Which diagnosis codes represent MDD?
- Which column identifies the patient?
- Which date column should be used for lookback calculations?

The Semantic Agent helps establish these mappings.

<img width="529" height="293" alt="image" src="https://github.com/user-attachments/assets/eb2f2732-2dd7-41b9-9306-87d81bc97b07" />


### What does it produce?

Conceptually, a semantic mapping such as:

```
{
  "business_concept": "Patient Diagnosis",
  "source_table": "CLAIMS_DX",
  "patient_key": "PATIENT_ID",
  "diagnosis_code": "DIAGNOSIS_CODE",
  "event_date": "SERVICE_DATE"
}
```

This is an illustrative representation, not a confirmed registry or output format from your project.

### Real-world importance

Without semantic mapping, an agent may generate SQL using an incorrect table or column.

For example, it might confuse a prescription date with a diagnosis date. Semantic understanding helps reduce these mapping errors.

Reverse KT question: How does the Semantic Agent discover table metadata, map business concepts to physical columns, and persist approved mappings?

## 2. Patient Universe Agent – Identifies the target patient population

Second: Identify relevant patients

### What is the purpose?

The Patient Universe Agent defines which patients should be included in a particular business or analytical use case.

It converts business requirements into patient inclusion and exclusion rules.

Think of it as a patient eligibility filter.

### Example

The pharmaceutical company wants to study patients with MDD.

A business requirement could be:

"Identify patients with an MDD diagnosis and evidence of antidepressant treatment."

The Patient Universe Agent translates this into rules.

| Rule        | Business condition                                  | Example time window |
| ----------- | --------------------------------------------------- | ------------------- |
| Inclusion 1 | At least one qualifying MDD diagnosis               | Previous 24 months  |
| Inclusion 2 | At least one qualifying antidepressant prescription | Previous 12 months  |
| Lookforward | No future observation period                        | 0 months            |

These time windows are consistent with the example rules visible in your ZIP screenshots.

### How does it work?

<img width="531" height="495" alt="image" src="https://github.com/user-attachments/assets/196b114e-055a-4b5e-9b56-cb578347d81d" />


### Simple SQL illustration

The following is illustrative SQL. Actual table names, code baskets, joins and date logic must be checked in your project.

```
SELECT DISTINCT
    d.PATIENT_ID
FROM CLAIMS_DX d
JOIN CLAIMS_RX r
    ON d.PATIENT_ID = r.PATIENT_ID
WHERE d.DIAGNOSIS_CODE IN (
    SELECT DIAGNOSIS_CODE
    FROM MDD_DIAGNOSIS_BASKET
)
AND d.SERVICE_DATE >= DATEADD(MONTH, -24, CURRENT_DATE())
AND r.RX_DATE >= DATEADD(MONTH, -12, CURRENT_DATE());
```

### What does it produce?

A qualifying patient population, potentially with additional patient attributes and profiling information.

Your screenshot displays:

- 231,511 total patients.
- 18.4K excluded patients.
- Three included rule groups.

These are UI-displayed figures, not verified live production results.

Reverse KT question: Which Python function converts patient inclusion/exclusion rules into technical rules and executes the resulting SQL?

## 3. HCP Universe Agent – Identifies relevant healthcare professionals

Third: Identify relevant doctors

### What is the purpose?

HCP stands for Healthcare Professional.

The HCP Universe Agent identifies the doctors or healthcare professionals who are relevant to the business objective.

Think of it as a doctor eligibility and segmentation filter.

### Example

For the MDD use case, the pharmaceutical company wants to identify psychiatrists who are relevant to MDD treatment.

Example business rules:

| Rule        | Business condition                           | Example time window |
| ----------- | -------------------------------------------- | ------------------- |
| Inclusion 1 | HCP has Psychiatry specialty                 | Previous 24 months  |
| Inclusion 2 | HCP has prescribed qualifying MDD treatments | Previous 12 months  |

### How does it work?

Suppose your database has:

`HCP_DIM`

| HCP_ID | HCP_NAME | SPECIALTY   |
| ------ | -------- | ----------- |
| H1001  | Doctor A | Psychiatry  |
| H1002  | Doctor B | Cardiology  |
| H1003  | Doctor C | Psychiatry  |
| H1004  | Doctor D | Dermatology |

And prescription-related records identify which doctors prescribed MDD treatments.

The HCP Universe Agent evaluates the business rules and selects eligible doctors.

<img width="534" height="395" alt="image" src="https://github.com/user-attachments/assets/ad620a33-137d-464f-a72b-d0a8b499b7c0" />


### What does it produce?

An eligible HCP population, potentially containing:

- HCP ID.
- Specialty.
- Prescribing activity.
- Relevant territory.
- Other mapped attributes.

Your screenshots show `FINAL_HCP_UNIVERSE` and `HCP_ATTRIBUTES` as UI-visible object labels. Their existence as actual Snowflake tables must be verified.

### Patient Universe versus HCP Universe

| Patient Universe                  | HCP Universe                  |
| --------------------------------- | ----------------------------- |
| Identifies relevant patients      | Identifies relevant doctors   |
| Uses patient diagnoses            | Uses HCP specialty            |
| Uses patient prescription history | Uses HCP prescribing activity |
| Patient-level population          | HCP-level population          |
| Supports patient analysis         | Supports HCP targeting        |

Important: Both are shown as separate universe workflows in your screenshots. Do not state that the HCP Agent depends on the Patient Universe output unless the actual SQL or Python execution confirms it.

Reverse KT question: How does the HCP Agent map specialty and prescribing rules to the underlying source tables, and where does it save the final HCP population?

## 4. Hypothesis Agent – Identifies potential business opportunities

Fourth: Identify opportunities

### What is the purpose?

The Hypothesis Agent uses business context and relevant healthcare information to generate potential hypotheses that could explain an opportunity for action.

Think of it as a business opportunity discovery agent.

A hypothesis is not simply a database filter. It is a testable business statement that suggests a potential pattern or opportunity.

### Example

Consider the MDD use case.

The business wants to understand whether there may be an opportunity to engage certain psychiatrists based on their prescribing behaviour.

An illustrative hypothesis:

"Psychiatrists who have treated MDD patients recently but have limited recent prescribing activity for the target product may represent an opportunity for further educational engagement."

This is a hypothesis to investigate, not a proven fact.

### How does the agent work?

The screenshots show two stages.

Stage 1: Hypothesis Generation

The agent considers business context and available domains.

Visible domains include:

- Patients.
- Prescriber.
- Network.
- Market Access.
- Promotion.

For example, it could explore:

| Domain        | Example question                                                  |
| ------------- | ----------------------------------------------------------------- |
| Patient       | Are there changes in patient diagnosis or treatment patterns?     |
| Prescriber    | Which psychiatrists show relevant prescribing patterns?           |
| Network       | Are there relationships or referral patterns worth investigating? |
| Market Access | Are access barriers affecting treatment?                          |
| Promotion     | Is there an engagement opportunity?                               |

Stage 2: Review and Edit

The interface allows users to:

- Review generated hypotheses.
- Read the rationale.
- Inspect supporting evidence.
- Compare similar hypotheses.
- Edit hypothesis statements.
- Select or reject hypotheses.
- Send selected hypotheses to Feature Mapping.

<img width="529" height="333" alt="image" src="https://github.com/user-attachments/assets/bde90204-ffe8-4f8b-8960-700fdb36b7d5" />


### What does it produce?

A collection of hypothesis records, potentially containing:

- Hypothesis statement.
- Business domain.
- Rationale.
- Supporting evidence.
- Similar hypothesis references.
- Selection or approval status.

The exact record structure and the LLM prompt/model used must be confirmed from source code.

Reverse KT question: What prompt and context does the Hypothesis Agent use, how does it retrieve supporting evidence, and how are selected hypotheses passed to the Feature Agent?

## 5. Feature Agent – Converts hypotheses into measurable features

Best agent for your end-to-end Reverse KT

### What is the purpose?

The Feature Agent converts a selected business hypothesis into measurable variables that can be calculated from healthcare data.

Think of it as a bridge between business reasoning and technical data implementation.

A hypothesis describes a potential business opportunity. A feature defines how to measure that opportunity using data.

### Example

Selected hypothesis:

"Psychiatrists who treat MDD patients but have limited recent prescribing activity for the target product may represent an opportunity for educational engagement."

The Feature Agent asks:

What measurable data points can help evaluate this hypothesis?

Possible feature candidates:

| Feature                        | What it measures                                       |
| ------------------------------ | ------------------------------------------------------ |
| `MDD_Patient_Count_12M`        | Number of MDD patients treated by an HCP               |
| `Target_Product_RX_Count_12M`  | Target-product prescriptions in the previous 12 months |
| `Treatment_Initiation_Recency` | Time since relevant treatment initiation               |
| `Prior_Therapy_Count`          | Number of prior therapies                              |
| `MDD_Comorbid_Anxiety_Flag`    | Whether an anxiety comorbidity is present              |

These are illustrative candidates; the first two are not claimed to be actual feature IDs in your screenshots. The other three names are visible in the screenshot examples.

### How does the Feature Agent work?

Your ZIP screenshots show five stages.

## Feature Agent workflow

1. Understand selected hypotheses

   Understand the business statement, its domain and what needs to be measured.

   Example: Identify psychiatrists with MDD treatment activity but limited target-product prescribing.
2. Identify relevant data sources

   Identify the source tables and semantic mappings required.

   Example: diagnosis, prescription, patient and HCP data.
3. Create feature candidates

   Define measurable variables.

   Example: MDD patient count, prescription count and treatment recency.
4. Map features to hypotheses and domains

   Associate each feature with the hypothesis it helps evaluate.

   Example: prescription count supports the prescribing-behaviour hypothesis.
5. Validate feature definitions

   Review the feature logic, business definition and data availability.

### Functional Business Rules (FBR)

The Feature Agent then presents functional business rules.

Example:

| Field               | Example                                       |
| ------------------- | --------------------------------------------- |
| Feature ID          | `Target_Product_RX_Count_12M`                 |
| Business definition | Count qualifying target-product prescriptions |
| Time period         | Previous 12 months                            |
| Entity              | HCP                                           |
| Status              | Needs review / Approved                       |

This explains the feature in business language.

### Technical Rules

Next, the functional definition is translated into technical logic.

Illustrative SQL:

```
SELECT
    HCP_ID,
    COUNT(*) AS TARGET_PRODUCT_RX_COUNT_12M
FROM CLAIMS_RX
WHERE PRODUCT_ID = 'TARGET_PRODUCT'
  AND RX_DATE >= DATEADD(
      MONTH, -12, CURRENT_DATE()
  )
GROUP BY HCP_ID;
```

The actual implementation may use different tables, joins, product baskets, date conditions or aggregation logic.

### SQL Code Generation

Your screenshots show these layers:

| Layer | Displayed purpose          |
| ----- | -------------------------- |
| L1    | Intermediate preparation   |
| L2    | Primary feature-ready data |
| L3    | Patient Universe objects   |
| L4    | HCP Universe objects       |
| L5    | Feature Layer              |

The interface suggests that existing Patient and HCP Universe objects can be reused while the Feature Layer contains selected feature objects.

### MRD Assembly

After feature creation, the screenshots show an MRD Assembly stage.

The displayed configuration includes:

- Approved HCP Universe as the base dataset.
- Five approved features.
- HCP-month entity grain.
- Three-month and six-month rollup windows.
- Next-month NRx target variable.

The displayed output contains 48,216 rows and five features. These are screenshot figures, not independently verified execution results.

Reverse KT question: How does the Feature Agent transform an approved functional rule into technical logic, generate SQL and materialize the feature-layer objects?

# 6. How all five agents work together

Here is the key relationship to remember:

<img width="529" height="405" alt="image" src="https://github.com/user-attachments/assets/25570ba1-fe0c-4955-a86c-b6097009a0d6" />


Note: This is a conceptual dependency diagram based on the visible workflow. It does not establish that Patient Universe and HCP Universe execute in a particular order, or that Hypothesis directly consumes both outputs. Those dependencies need to be verified from orchestration and SQL.

## 7. Important differences between the five agents

| Agent            | Main question it answers                                   | Main output                                  |
| ---------------- | ---------------------------------------------------------- | -------------------------------------------- |
| Semantic         | Where is the required information and what does it mean?   | Semantic mappings                            |
| Patient Universe | Which patients qualify?                                    | Patient population                           |
| HCP Universe     | Which doctors qualify?                                     | HCP population                               |
| Hypothesis       | What potential business opportunity should we investigate? | Selected hypotheses                          |
| Feature          | How can we measure that opportunity using data?            | Features, business rules and technical logic |

My recommendation for your Reverse KT: Learn the distinction between the five agents first, then focus on the Feature Agent's complete chain: selected hypothesis → data source → feature candidate → functional business rule → technical rule → SQL → Feature Layer. That is the clearest way to demonstrate how the business requirement becomes an actual analytical dataset.
