# UI Component Library

This directory contains a comprehensive set of reusable UI components for the Minecraft Mod Downloader frontend. All components are built with TypeScript, use Tailwind CSS for styling, and follow consistent design patterns.

## Components

### Button
A versatile button component with multiple variants, sizes, and states.

```tsx
import { Button } from '../ui';

<Button variant="primary" size="md" loading={false}>
  Click me
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
- `size`: 'sm' | 'md' | 'lg'
- `loading`: boolean - Shows spinner and disables button
- `leftIcon`: React.ReactNode - Icon before text
- `rightIcon`: React.ReactNode - Icon after text
- `asChild`: boolean - Renders as child element (useful for Link components)

### Input
A form input component with consistent styling and error handling.

```tsx
import { Input } from '../ui';

<Input 
  label="Email"
  type="email"
  placeholder="Enter your email"
  error="Invalid email"
  leftIcon={<FiMail />}
/>
```

**Props:**
- `label`: string - Input label
- `error`: string - Error message
- `leftIcon`: React.ReactNode - Icon on the left
- `rightIcon`: React.ReactNode - Icon on the right
- All standard HTML input props

### Card
A container component for content sections with header, content, and footer areas.

```tsx
import { Card, CardHeader, CardContent, CardFooter } from '../ui';

<Card>
  <CardHeader>
    <h2>Card Title</h2>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Dropdown
A dropdown/select component for options selection.

```tsx
import { Dropdown } from '../ui';

const options = [
  { label: "Option 1", value: "1" },
  { label: "Option 2", value: "2" }
];

<Dropdown
  options={options}
  value={selectedValue}
  onValueChange={setSelectedValue}
  placeholder="Select option"
/>
```

**Props:**
- `options`: DropdownOption[] - Array of options
- `value`: string | number - Selected value
- `onValueChange`: (value: string | number) => void - Change handler
- `placeholder`: string - Placeholder text
- `disabled`: boolean - Disable dropdown
- `leftIcon`: React.ReactNode - Icon before text

### Alert
A notification component for displaying messages with different variants.

```tsx
import { Alert } from '../ui';

<Alert variant="error" title="Error" onClose={() => setError(null)}>
  Something went wrong
</Alert>
```

**Props:**
- `variant`: 'success' | 'error' | 'warning' | 'info'
- `title`: string - Alert title
- `onClose`: () => void - Close handler
- `children`: React.ReactNode - Alert content

### ProgressBar
A progress indicator component for showing loading states.

```tsx
import { ProgressBar } from '../ui';

<ProgressBar 
  value={75} 
  max={100} 
  showLabel 
  variant="success"
  size="md"
/>
```

**Props:**
- `value`: number - Current progress value
- `max`: number - Maximum value (default: 100)
- `showLabel`: boolean - Show percentage label
- `variant`: 'default' | 'success' | 'warning' | 'error'
- `size`: 'sm' | 'md' | 'lg'

### Badge
A small component for displaying tags, status indicators, and labels.

```tsx
import { Badge } from '../ui';

<Badge variant="success" size="md">
  Active
</Badge>
```

**Props:**
- `variant`: 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline'
- `size`: 'sm' | 'md' | 'lg'
- `children`: React.ReactNode - Badge content

### LoadingSpinner
A loading indicator component.

```tsx
import { LoadingSpinner } from '../ui';

<LoadingSpinner size="md" variant="primary" />
```

**Props:**
- `size`: 'sm' | 'md' | 'lg'
- `variant`: 'default' | 'primary'

### Modal
A modal/dialog component for overlays and dialogs.

```tsx
import { Modal } from '../ui';

<Modal 
  isOpen={isModalOpen} 
  onClose={() => setIsModalOpen(false)}
  title="Modal Title"
  size="md"
>
  <p>Modal content goes here</p>
</Modal>
```

**Props:**
- `isOpen`: boolean - Controls modal visibility
- `onClose`: () => void - Close handler
- `title`: string - Modal title
- `size`: 'sm' | 'md' | 'lg' | 'xl'

## Design System

### Colors
- **Primary**: Green theme (green-400 to green-700)
- **Background**: Dark slate theme (slate-800 to slate-900)
- **Text**: White and green variants
- **Borders**: Green accents with transparency

### Spacing
- Consistent spacing using Tailwind's spacing scale
- Padding: p-2, p-4, p-6
- Margins: m-2, m-4, m-6
- Gaps: gap-2, gap-4, gap-6

### Typography
- Headings: text-xl, text-2xl, text-3xl
- Body: text-sm, text-base, text-lg
- Font weights: font-medium, font-semibold, font-bold

### Transitions
- All interactive elements have smooth transitions
- Duration: duration-200, duration-300
- Easing: ease-in-out

## Usage Guidelines

1. **Consistency**: Always use these components instead of creating custom styled elements
2. **Accessibility**: All components include proper ARIA attributes and keyboard navigation
3. **Responsive**: Components are designed to work across all screen sizes
4. **Theming**: Components use CSS custom properties for easy theming
5. **TypeScript**: All components are fully typed for better development experience

## Utilities

### cn (className utility)
A utility function for merging class names with Tailwind CSS conflict resolution.

```tsx
import { cn } from '../../utils/cn';

const className = cn(
  "base-classes",
  conditional && "conditional-classes",
  "additional-classes"
);
```

## Migration Guide

When migrating existing components to use the new UI library:

1. Replace custom styled buttons with the `Button` component
2. Replace form inputs with the `Input` component
3. Replace custom containers with the `Card` component
4. Replace custom dropdowns with the `Dropdown` component
5. Replace custom alerts with the `Alert` component
6. Replace custom progress bars with the `ProgressBar` component
7. Replace custom badges with the `Badge` component
8. Replace custom loading spinners with the `LoadingSpinner` component
9. Replace custom modals with the `Modal` component

This ensures consistency across the application and reduces code duplication.
