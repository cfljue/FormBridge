# Security Policy

## Supported versions

Security fixes are provided for the latest published release.

## Reporting a vulnerability

Please do not open a public issue for vulnerabilities involving Cookie access, privilege boundaries, data exposure, or extension permissions.

Use GitHub Private Vulnerability Reporting if it is enabled for the repository. Otherwise, contact the maintainer through the GitHub profile associated with this repository and request a private channel.

Include:

- A concise description of the issue and its impact
- Reproduction steps or a minimal proof of concept
- Affected browser and FormBridge version
- Any suggested mitigation

You can expect an acknowledgement within 7 days. Please allow time for a fix and coordinated release before public disclosure.

## Scope

High-priority reports include:

- Unauthorized access to Cookies or page storage
- Leakage of locally stored templates or form values
- Message-routing flaws that allow untrusted pages to invoke privileged operations
- Extension-page injection or code execution
- Permission escalation

Reports about intentionally transferring data after an explicit user action are not vulnerabilities by themselves.
