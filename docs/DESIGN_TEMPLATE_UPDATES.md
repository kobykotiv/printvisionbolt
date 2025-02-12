# Design and Template Updates Implementation Plan

## 1. New Components

### EditDesignModal
- Form for editing design metadata
- Preview of connected templates
- Ability to update design assets
- Location: `src/components/designs/EditDesignModal.tsx`

### ConnectedItemsModal
- Reusable component for showing connected items
- Supports both designs→templates and templates→designs views
- Includes stats and status information
- Location: `src/components/ui/ConnectedItemsModal.tsx`

### BulkUploadPage
- Dedicated page for bulk uploads
- Advanced configuration options
- Location: `src/pages/BulkUpload.tsx`

## 2. Updates to Existing Components

### Templates.tsx Changes
1. Add edit button to template cards
2. Add "View Connected Designs" button
3. Implement connection modal integration
4. Update template card layout

### Designs.tsx Changes
1. Add edit button to design cards
2. Add "View Connected Templates" button
3. Integrate EditDesignModal
4. Update design card layout

## 3. New Routes

```tsx
// Add to Routes.tsx
{
  path: '/bulk-upload',
  element: <ProtectedRoute><BulkUpload /></ProtectedRoute>
}
```

## 4. Service Updates

### templateService.ts
- Add methods for fetching connected designs
- Add template update endpoints

### designService.ts
- Add methods for fetching connected templates
- Add design update endpoints
- Add bulk upload configuration handling

## 5. Database Types

```typescript
// Add to types/design.ts
interface DesignUpdatePayload {
  title?: string;
  description?: string;
  tags?: string[];
  status?: 'active' | 'archived';
  metadata?: Record<string, unknown>;
}

// Add to types/template.ts
interface TemplateUpdatePayload {
  title?: string;
  description?: string;
  tags?: string[];
  status?: 'active' | 'archived';
  blueprints?: string[];
}
```

## 6. UI/UX Specifications

### Edit Modal
- Opens in center of screen
- Maximum width: 800px
- Form layout: two columns for larger screens
- Preview panel on right side
- Connected items shown in tabs below

### Card Updates
- Add edit button in top-right corner
- Add connection indicator showing count
- Update hover state to show quick actions

### Bulk Upload Page
1. Configuration Section
   - Numbering system selection
   - Prefix/suffix inputs
   - Preview of generated names
2. Upload Section
   - Drag and drop zone
   - Progress indicators
   - Error handling
3. Results Section
   - Summary of uploaded items
   - Quick actions for uploaded designs

## 7. Implementation Order

1. Create base components
   - EditDesignModal
   - ConnectedItemsModal
   - BulkUploadPage structure

2. Update services
   - Add new endpoints
   - Implement relationship queries

3. Modify existing pages
   - Update Templates.tsx
   - Update Designs.tsx

4. Add new route
   - Integrate bulk upload page
   - Update navigation

5. Testing
   - Unit tests for new components
   - Integration tests for relationships
   - End-to-end upload flow testing

## 8. Future Considerations

- Batch editing capabilities
- Template version control
- Advanced search/filter in connection modals
- Bulk operation support for connected items
- Export/import functionality for relationships