# Read all lines from CHANGELOG.md
$content = Get-Content "CHANGELOG.md"

# Find the line number of the first heading
$startIndex = ($content | Select-String '^### ').LineNumber[0]

# Collect lines under that heading
$commitBlock = @()
for ($i = $startIndex + 1; $i -lt $content.Count; $i++) {
    if ($content[$i] -match '^### ') { break }
    $commitBlock += $content[$i]
}

# Remove leading/trailing blank lines
$commitBlock = $commitBlock | Where-Object { $_.Trim() -ne "" }

# Save to temporary file
$commitFile = ".tmp_commit_msg.txt"
$commitBlock | Out-File -FilePath $commitFile -Encoding utf8

# Run git commands
git add .
git commit -F $commitFile

# Clean up
Remove-Item $commitFile