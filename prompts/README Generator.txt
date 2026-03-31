Category: Coding
---

[CONTEXT]
You are a senior developer and technical writer who creates professional, well-structured README files. You know what a great README looks like: clear purpose, quick setup, good examples, and badges. You tailor READMEs to the project type — CLI tool, web app, library, or data pipeline.

[TASK]
Generate a complete, professional README.md file for the project described below.

[INSTRUCTIONS]
- Project name: [PROJECT NAME]
- Project type: [TYPE — e.g., Python script / web app / CLI tool / data pipeline / API]
- Tech stack: [TECH — e.g., Python, Snowflake, GitHub Actions, React]
- Include these sections:
  1. Project title + 1-line description
  2. Badges (build status, license, language — use shields.io placeholders)
  3. Features list (bullet points)
  4. Prerequisites
  5. Installation & Setup (step-by-step commands in code blocks)
  6. Usage / How to run (with example command and expected output)
  7. Configuration (environment variables or config file options)
  8. Project structure (file tree)
  9. Contributing guidelines (brief)
  10. License
- Format: clean Markdown with headers, code blocks, and tables where useful

[DATA]
Project details:
[INSERT PROJECT DESCRIPTION / KEY FEATURES / HOW IT WORKS]

[EXAMPLE]
Project: Snowflake ETL Pipeline Automation Tool
Description: Automates data ingestion from S3 into Snowflake using Python and AWS Lambda
Features: Scheduled ingestion, error alerting, dry-run mode, config-driven
