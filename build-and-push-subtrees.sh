#!/bin/bash

# Script to build each sub-app in the monorepo, create git subtrees, and push build results

# Set the GitHub repository URL
REPO_URL="git@github.com:flash-oss/lil-altair.git"

# Create a temporary directory for build outputs
mkdir -p temp_builds

# Function to build a package and create/push a subtree
build_and_push_subtree() {
  local package_dir=$1
  local package_name=$(basename "$package_dir")
  local branch_name="${package_name}-pkg"

  echo "Processing $package_name..."

  # Build the package
  echo "Building $package_name..."
  cd "$package_dir"

  # Get the package version
  local package_version=$(grep -o '"version": "[^"]*"' package.json | cut -d'"' -f4)

  # Check if there's a build script in package.json
  if grep -q "\"build\":" package.json; then
    pnpm build
  elif grep -q "\"declarations\":" package.json; then
    pnpm declarations
  elif grep -q "\"bootstrap\":" package.json; then
    pnpm bootstrap
  else
    echo "No build script found for $package_name, skipping build step"
  fi

  # Prepare the build output
  if [ -d "build" ]; then
    BUILD_DIR="build"
  elif [ -d "dist" ]; then
    BUILD_DIR="dist"
  else
    echo "No build or dist directory found for $package_name, skipping"
    cd - > /dev/null
    return
  fi

  # Copy the build output to a temporary directory
  echo "Copying build output for $package_name..."
  mkdir -p "../../temp_builds/$package_name"

  rsync -av --exclude="node_modules" "$BUILD_DIR/" "../../temp_builds/$package_name/"

  # Copy package.json
  cp package.json "../../temp_builds/$package_name/"

  # Return to the root directory
  cd - > /dev/null

  # Replace workspace references in package.json with actual versions
  echo "Replacing workspace references in package.json..."
  sed -i.bak 's/"workspace:\*"/"'"$package_version"'"/g' "temp_builds/$package_name/package.json"
  sed -i.bak 's/"catalog:"/"^5.8.0"/g' "temp_builds/$package_name/package.json"
  rm "temp_builds/$package_name/package.json.bak"

  # Commit the changes to the temp_builds directory
  echo "Committing build output for $package_name..."
  git add -f temp_builds/$package_name
  git commit -m "Build output for $package_name" --allow-empty

  # Create or update the subtree
  echo "Creating/updating subtree for $package_name..."

  # Check if the branch already exists in the remote repository
  if git ls-remote --heads $REPO_URL $branch_name | grep -q $branch_name; then
    # Branch exists, update it
    echo "Branch $branch_name already exists, updating..."
    if git subtree split --prefix=temp_builds/$package_name -b temp-$branch_name; then
      git push -f $REPO_URL temp-$branch_name:$branch_name
      git branch -D temp-$branch_name
    else
      echo "Failed to create temporary branch for $package_name, skipping push"
    fi
  else
    # Branch doesn't exist, create it
    echo "Creating new branch $branch_name..."
    if git subtree split --prefix=temp_builds/$package_name -b $branch_name; then
      git push -u $REPO_URL $branch_name
    else
      echo "Failed to create branch for $package_name, skipping push"
    fi
  fi

  echo "Successfully processed $package_name"
  echo "-------------------------------------------"
}

# Main script execution
echo "Starting build and subtree creation process..."

# Check for a specific package name argument
if [ "$1" != "" ]; then
  # Deploy a single package
  package_name=$1
  package_dir="packages/$package_name"

  if [ -d "$package_dir" ]; then
    echo "Deploying single package: $package_name"
    build_and_push_subtree "$package_dir"
  else
    echo "Error: Package '$package_name' not found in packages directory."
    echo "Available packages:"
    ls -1 packages/
    exit 1
  fi
else
  # Make sure we're in the root directory of the monorepo
  if [ ! -d "packages" ]; then
    echo "Error: packages directory not found. Make sure you're in the root of the monorepo."
    exit 1
  fi

  # Process each package
  for package_dir in packages/*; do
    if [ -d "$package_dir" ]; then
      build_and_push_subtree "$package_dir"
    fi
  done
fi

# Clean up
echo "Cleaning up temporary build directory..."
rm -rf temp_builds
git add -u
git commit -m "Clean up temp_builds directory"

echo "All packages have been built and pushed to their respective subtrees."
echo "Packages can be accessed in your project's package.json using the format:"
echo "\"package-name\": \"github:SamYevmenenko30/lil-altair#package-name-pkg\""
