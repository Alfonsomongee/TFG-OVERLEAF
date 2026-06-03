$ErrorActionPreference = "Continue"

Write-Output "--- OUTPUT 1 ---"
(Get-ChildItem docs -Recurse -Filter "*.mdx").Count

Write-Output "--- OUTPUT 2 ---"
Get-ChildItem i18n -Recurse -Filter "*.json" | Select-Object FullName | Where-Object { $_.FullName -like "*en*" -or $_.FullName -like "*de*" -or $_.FullName -like "*zh*" }

Write-Output "--- OUTPUT 3 ---"
Get-ChildItem i18n -Recurse -Depth 2 | Select-Object FullName | Select-Object -First 40

Write-Output "--- OUTPUT 4 ---"
Select-String -Path docusaurus.config.js -Pattern "locales|defaultLocale"

Write-Output "--- OUTPUT 5 ---"
Get-ChildItem src\data -Filter "glossary*"

Write-Output "--- OUTPUT 6 ---"
(Get-Item docs\03-analisis-incidente.mdx).Length / 1KB
