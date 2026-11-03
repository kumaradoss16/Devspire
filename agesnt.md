# Feature FBR – Latest Change Analysis: Simple Overall Summary for Reverse KT

The latest Feature FBR changes mainly focus on improving feature-generation quality, handling multiple features efficiently, and making validation and output processing more reliable.

Previously, the system processed all 15 features in a single request. This caused output limitations, resulting in two missing features and one incomplete feature.

To solve this problem, the team introduced a batch-processing approach and improved the skill, prompt, tools, and Python pipeline.

## 1. What changed?

| Component             | Main change                                                           | Purpose                                       |
| --------------------- | --------------------------------------------------------------------- | --------------------------------------------- |
| Skill – SK-FBR-FE-02  | Replaced generic examples with seven realistic nephrology examples    | Improve FBR generation quality                |
| Prompt – PR-FBR-FE-01 | Introduced a six-step output structure and self-check                 | Make generated FBRs consistent                |
| TL-01                 | Added comments only                                                   | Improve readability                           |
| TL-02                 | Groups features into batches of five and creates individual prompts   | Avoid output truncation                       |
| TL-03                 | Executes one Cortex call per batch in parallel                        | Improve generation workflow                   |
| TL-04                 | Improved response parsing and validation                              | Prevent incorrect and missing feature outputs |
| Python pipeline       | Added batching, logging, status handling and persistence improvements | Improve overall execution reliability         |

## 2. How does the latest workflow work?

<img width="534" height="412" alt="image" src="https://github.com/user-attachments/assets/a07b9e05-f33a-4f74-9820-79449ba88cdc" />


## 3. Simple example of batching

Suppose we have 15 approved features.

| Batch   | Features       |
| ------- | -------------- |
| Batch 1 | Features 1–5   |
| Batch 2 | Features 6–10  |
| Batch 3 | Features 11–15 |

Each batch gets its own prompt and Cortex generation call. TL-04 then parses and validates the generated responses.

If a feature is missing from the generated response, it is marked `FAILED - NOT GENERATED`, according to the change summary.

## 4. Important pipeline improvements

The Python pipeline now includes:

- `BATCH_SIZE = 5`.
- Stops when no approved features are available.
- Executes TL-03 directly instead of creating a view.
- Logs batch details and pass/fail counts.
- Saves `DRAFT` for rules that pass and `VALIDATION_FAILED` for rules that fail.
- Adds `RULE_STATUS` and `VALIDATION_STATUS` to `DATA_SUPPORT_VALIDATION`.
- Writes output columns by name.
- Adds a separate `PERSIST` logging step.
- Returns `SUCCESS` or `PARTIAL` with counts.

## 5. What remains unchanged?

According to the change-summary document:

- `01_setup_tables.sql` – unchanged.
- `07_stored_procs.sql` – unchanged.
- `deploy_to_stage.py` – unchanged.

The actual deployment status still needs confirmation.

## 6. Two-minute Reverse KT explanation

You can use this as your meeting explanation:

> The latest Feature FBR changes were introduced mainly to improve the reliability and quality of feature generation.
>
> Previously, all 15 features were processed in a single request, which caused output truncation and missing features.
>
> To address this, the team introduced batch processing with a batch size of five.
>
> TL-02 creates the batches and prepares individual prompts. TL-03 executes Cortex generation for each batch in parallel. TL-04 parses the generated responses, validates the feature-level outputs and identifies missing features.
>
> The skill and prompt were also improved with realistic nephrology examples, a structured six-step format and additional validation checks.
>
> Finally, the Python pipeline manages execution, logging, persistence and feature statuses. It returns SUCCESS or PARTIAL depending on the processing results.
>
> Overall, the objective is to generate more reliable FBR outputs, reduce missing features and improve validation and monitoring.

## 7. Five things you must remember

1. Why batching? To prevent output truncation and missing features.
2. What does TL-02 do? Creates batches and builds prompts.
3. What does TL-03 do? Executes Cortex generation for each batch.
4. What does TL-04 do? Parses and validates the generated FBR output.
5. What does Python do? Coordinates execution, logging, status management and persistence.

Important for Reverse KT

This explanation is based on the uploaded change-summary document, not independently verified source code. In particular, confirm the six-step prompt versus five-step TL-04 validation difference, status handling, and deployment status with Mitra.

My recommendation: Focus your Reverse KT preparation on the relationship between TL-02 → TL-03 → TL-04 → Python pipeline. Understanding this execution flow will help you explain the most important changes confidently.
