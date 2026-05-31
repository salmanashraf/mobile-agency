# Figma Spec — Product Detail Screen

## Design Overview

**Screen:** Product Detail  
**Platform:** Android (Jetpack Compose)  
**Design System:** Material3

---

## Layout

- Full-screen scroll
- Hero image: full width, 280dp height, `contentScale = ContentScale.Crop`
- Content section below image: 16dp horizontal padding, 24dp top padding

## Components

### Product Title
- Typography: `headlineMedium` (28sp, SemiBold)
- Color: `MaterialTheme.colorScheme.onSurface`
- Max 2 lines, ellipsis overflow

### Price
- Typography: `titleLarge` (22sp, Bold)  
- Color: `#1A73E8` (primary brand blue)
- Below title, 4dp spacing

### Rating Row
- Star icons (filled/empty): 16dp each, 4dp spacing between
- Rating text: `bodyMedium`, `onSurfaceVariant` color
- Review count: "(1,247 reviews)" in parentheses, same style

### Description
- Typography: `bodyLarge`
- Color: `onSurfaceVariant`
- Expandable: show 3 lines collapsed, "Read more" tap to expand

### Add to Cart Button
- PrimaryButton component (see examples/android-code-review/ for spec)
- Label: "Add to Cart"
- Bottom of screen, sticky (always visible), 16dp all padding

## States

- **Loading:** skeleton shimmer for image + title + price
- **Error:** full-screen error state with retry button
- **Out of Stock:** "Add to Cart" button disabled, text changes to "Out of Stock"

## Accessibility

- Hero image: contentDescription = "{productName} product image"
- Star rating: accessibilityLabel = "{rating} out of 5 stars, {count} reviews"
- Add to Cart: standard button accessibility
