module.exports = {
  branches: [
    "main",
    {
      name: "next",
      prerelease: true,
      channel: "next",
    },
    {
      name: "beta",
      prerelease: true,
      channel: "beta",
    },
    {
      name: "alpha",
      prerelease: true,
      channel: "alpha",
    },
  ],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/npm",
    [
      "@semantic-release/github",
      {
        assets: [
          {
            path: "dist/**/*",
            label: "Distribution files",
          },
        ],
      },
    ],
    [
      "@semantic-release/git",
      {
        assets: ["CHANGELOG.md", "package.json"],
        message:
          "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
      },
    ],
  ],
};
