# Profile Page Improvements

## Tasks to Complete:
- [x] Move change avatar button from settings to user info card
- [x] Remove change password form and button from settings
- [x] Reorder profile cards: user-info, purchase history, stats, recommendations (full width)
- [x] Make recommendations section horizontal layout and full width
- [x] Ensure user info and stats are properly populated with data
- [x] Add calculations for stats (games owned, wishlist count, total spent, badges)
- [x] Test the profile page functionality

## Information Gathered:
- Profile page has 4 cards: user-info, stats, purchase-history, recommendations, settings
- updateProfile() function fetches user data and populates fields
- Stats need to be calculated: games owned (library.length), wishlist count (wishlist.length), total spent (sum of game prices), badges (based on achievements)
- Recommendations are fetched via API and displayed in grid
- Change avatar currently in settings, needs to move to user-info
- Change password form needs to be removed

## Plan:
1. Edit HTML to reorder cards and move change avatar
2. Remove change password elements
3. Modify recommendations CSS to horizontal layout
4. Update updateProfile() to calculate and populate stats
5. Test profile page

## Dependent Files:
- public/index.html (main changes)
- server.js (may need API updates if stats calculation requires backend)

## Followup Steps:
- Test login and profile page
- Verify stats calculations
- Check horizontal recommendations layout
- Ensure change avatar works from user info
