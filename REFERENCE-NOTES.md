# October 19 recording update

Reference: the user-supplied `ScreenRecording_10-19-2026 09-37-34_1.mp4` (56.85 seconds).

## Included

- Empty-account welcome card and Deposit action, using the welcome and fire artwork extracted from the supplied recording.
- Dismissible Hot Markets card. The Home Explore Markets section was removed at the user’s request; Make your move opens the Trade tab.
- Reference market entries including HOOKR, SPCX, CTR, MORPHO, NEAR, WEFT, HYPE, PUMP, and POL; these also appear in search and token selection.
- Interactive token charts with a selected price, cursor, faded future segment, time/sample label, baseline, and Bitcoin step chart. Timeframe controls fit an iPhone-width screen. Chart gestures do not dismiss the sheet.
- Sticky token name/price, favorites, sharing, alerts, Receive, local chat, reference holders, About, and market facts.
- Buy amount presets of $10, $25, and $50; the Trade menu includes Long, Short, and Buy.
- Profile with Manage, profile photos, editable bio, Open/Closed positions, and sharing.
- Refer & Earn screen with totals, reward details, copyable demo referral code, and native sharing when supported.
- Searchable Settings and an Invite your friends link to Refer & Earn.

## Preview behavior

Saved accounts, balances, and photos are preserved. Empty accounts display the welcome layout from the recording. To see it, create an empty account through the account switcher. Accounts with balances keep their existing portfolio and the newly added market section.

This remains a local wallet demo. The recording's Trending prices and HOOKR holder list are reference snapshots, identified in the interface. Existing market APIs can update supported quotes; generated fallback chart history is identified as illustrative. Chat messages stay on the current device. Referrals are a visual demo with no active rewards, registered referral links, or referral service. The share/copy actions share the demo code. No verified token website is invented. Existing trading actions are local simulations, not blockchain transactions or an exchange connection.

## Validation

Production build and JavaScript syntax checks passed. React interaction checks cover funded and empty accounts, market filtering, HOOKR details and buy screen, Bitcoin Trade menu and chart selection, saved chat messages, profile bio, positions tabs, referral details, and preservation of existing balances. Design detector returned no findings for the edited components.

These checks do not replace testing on a physical iPhone. The GitHub workflow is included but no IPA build was run on GitHub during this update.

## Artwork provenance

`ReferenceArtwork.js` embeds two crops from the supplied recording at 33 seconds: the welcome illustration and the Hot Markets flame. These are included as data URLs so both the standalone preview and packaged application work without additional image requests.

## Cash screen update

The Home Cash button, Deposit button, and Add Cash shortcut now open the screenshot-inspired Cash screen with an account-specific balance, pastel card illustration, and Receive Stablecoins / Buy Instantly / Bank Transfer rows. The options menu opens activity. Stablecoin receiving is explicitly unconnected; no deposit address is provided. The two funding choices use the existing local balance simulator and clearly identify demo payments. Closing either funding form returns to Cash. Navigation and balance-update interaction checks passed.
