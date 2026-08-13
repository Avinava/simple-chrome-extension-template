# Security policy

## Supported versions

Security fixes are made on the latest code on `master`. This is a template, so
consumers should also apply fixes in the extensions they create from it.

## Reporting a vulnerability

Do not open a public issue for a suspected vulnerability. Contact the
maintainer through the email address on the repository owner's GitHub profile
and include:

- a concise description and impact;
- affected files, versions, or configuration;
- reproduction steps or a proof of concept; and
- any suggested mitigation.

An acknowledgement is targeted within seven days. Please allow time for a fix
and coordinated disclosure before sharing details publicly.

## Extension-specific guidance

Treat manifest permissions, injected scripts, message validation, and storage
contents as security-sensitive. Product extensions should remove unused demo
features and narrow host access before release.
