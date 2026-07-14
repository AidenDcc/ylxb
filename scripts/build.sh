#!/bin/bash
set -e

echo "🚀 Building YLXB (MedPal)..."

# Clean
rm -rf dist
mkdir -p dist

# Build all sub-packages
echo "📦 Building patient-h5..."
pnpm --filter @ylxb/patient-h5 build

echo "📦 Building doctor-h5..."
pnpm --filter @ylxb/doctor-h5 build

echo "📦 Building management-web..."
pnpm --filter @ylxb/management-web build

echo "📦 Building platform-web..."
pnpm --filter @ylxb/platform-web build

# Copy portal page (navigation entry)
echo "📋 Copying portal page..."
cp index.html dist/

# Copy sub-package builds to subdirectories
echo "📋 Aggregating sub-packages into dist/..."
cp -r packages/patient-h5/dist dist/patient
cp -r packages/doctor-h5/dist dist/doctor
cp -r packages/management-web/dist dist/management
cp -r packages/platform-web/dist dist/platform

echo ""
echo "✅ Build complete!"
echo "   Output: dist/"
echo "   Structure:"
echo "   ├── index.html          (portal navigation)"
echo "   ├── patient/            (patient-h5 SPA)"
echo "   ├── doctor/             (doctor-h5 SPA)"
echo "   ├── management/         (management-web SPA)"
echo "   └── platform/           (platform-web SPA)"
