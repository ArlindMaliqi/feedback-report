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
            path: "dist.tar.gz",
            name: "react-feedback-report-widget-${nextRelease.version}-dist.tar.gz",
            label: "Distribution Archive (${nextRelease.version})",
          },
          {
            path: "package.json",
            name: "package-${nextRelease.version}.json",
            label: "Package Configuration (${nextRelease.version})",
          },
          {
            path: "README.md",
            name: "README-${nextRelease.version}.md",
            label: "Documentation (${nextRelease.version})",
          },
        ],
        successComment: false,
        failComment: false,
        releasedLabels: false,
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
