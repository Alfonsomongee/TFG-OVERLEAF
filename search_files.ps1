Write-Output '--- 1. Downloads ---'
dir "$env:USERPROFILE\Downloads\"

Write-Output '--- 2. Filter ---'
dir "$env:USERPROFILE\Downloads\" | findstr /I "forensic fullwidth css"

Write-Output '--- 3. OneDrive Descargas ---'
dir "$env:USERPROFILE\OneDrive\Descargas\" 2>$null

Write-Output '--- 4. Global Search ---'
Get-ChildItem -Path "$env:USERPROFILE\" -Filter "*ForensicGallery*" -Recurse 2>$null | Select-Object FullName
