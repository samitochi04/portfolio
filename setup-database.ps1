# =============================================
# SAMUEL FOTSO PORTFOLIO - DATABASE SETUP SCRIPT
# =============================================
# This script sets up the Supabase database schema

Write-Host "🚀 Setting up Samuel FOTSO Portfolio Database..." -ForegroundColor Cyan

# Check if Supabase CLI is available
if (!(Get-Command "supabase" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Supabase CLI not found. Please install it first:" -ForegroundColor Red
    Write-Host "npm install -g supabase" -ForegroundColor Yellow
    exit 1
}

# Check if .env file exists
$envFile = "client\.env"
if (!(Test-Path $envFile)) {
    Write-Host "❌ Environment file not found at $envFile" -ForegroundColor Red
    Write-Host "Please create the .env file with your Supabase credentials" -ForegroundColor Yellow
    exit 1
}

# Load environment variables
Write-Host "📄 Loading environment variables..." -ForegroundColor Green
Get-Content $envFile | ForEach-Object {
    if ($_ -match "^([^=]+)=(.*)$") {
        [Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
    }
}

$supabaseUrl = $env:VITE_SUPABASE_URL
$supabaseKey = $env:VITE_SUPABASE_ANON_KEY

if (!$supabaseUrl -or !$supabaseKey) {
    Write-Host "❌ Supabase credentials not found in environment variables" -ForegroundColor Red
    Write-Host "Please check your .env file contains VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Environment variables loaded" -ForegroundColor Green

# Run the SQL schema setup
Write-Host "📊 Setting up database schema..." -ForegroundColor Green

# Check if the SQL file exists
$sqlFile = "server\scripts\supabase-setup.sql"
if (!(Test-Path $sqlFile)) {
    Write-Host "❌ SQL setup file not found at $sqlFile" -ForegroundColor Red
    exit 1
}

Write-Host "📝 SQL schema file found" -ForegroundColor Green
Write-Host "⚠️  Please run the following SQL script in your Supabase SQL Editor:" -ForegroundColor Yellow
Write-Host "File: $sqlFile" -ForegroundColor Cyan

Write-Host ""
Write-Host "🔗 Next steps:" -ForegroundColor Green
Write-Host "1. Copy the contents of $sqlFile" -ForegroundColor White
Write-Host "2. Go to your Supabase project dashboard" -ForegroundColor White
Write-Host "3. Navigate to SQL Editor" -ForegroundColor White
Write-Host "4. Paste and run the schema" -ForegroundColor White
Write-Host "5. Run the data seeding script if needed" -ForegroundColor White

Write-Host ""
Write-Host "📦 Optional: Seed sample data with:" -ForegroundColor Green
Write-Host "cd server && node scripts/seed-data.js" -ForegroundColor Cyan

Write-Host ""
Write-Host "🎉 Database setup instructions completed!" -ForegroundColor Green