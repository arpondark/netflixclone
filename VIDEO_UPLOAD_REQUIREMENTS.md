# Video Upload Requirements Update Summary

## Changes Made

### 1. README.md Updates

#### Added Database Schema with Mermaid Diagram
- Created comprehensive ER diagram showing all entities (USERS, VIDEOS, VIDEO_CATEGORIES, USER_WATCHLIST)
- Documented all fields with their types and constraints
- Added entity relationships section
- Added key constraints explanation

#### Updated Video Upload Documentation
Made the following fields REQUIRED for video upload:
- **Title**: Video title (cannot be blank)
- **Description**: Full description (up to 4000 characters, required)
- **Poster Image**: Thumbnail or poster image (required)
- **Video File**: The actual video file (required)
- **Categories/Genres**: At least one category must be selected (required)

Optional fields remain:
- Year
- Rating
- Duration
- Published status

#### Updated Usage Examples
- Changed examples to reflect required fields
- Renamed "Minimal Upload" to show it still requires all mandatory fields
- Added important notes about required fields

### 2. Backend Code Updates

#### VideoRequest.java (DTO)
Added validation annotations:
```java
@NotBlank(message = "Description is required")
@Size(max = 4000, message = "Description cannot be more than 4000 characters")
private String description;

@NotEmpty(message = "At least one category must be selected")
private List<String> categories;
```

#### VideoController.java
- Added `@Valid` annotation to validate VideoRequest
- Made `poster` parameter required (removed `required = false`)
- Removed unused imports

```java
@PostMapping("/upload")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<VideoResponse> uplloadVideo(
    @Valid @RequestPart("data") VideoRequest request,
    @RequestPart("video") MultipartFile video,
    @RequestPart("poster") MultipartFile poster
) throws IOException {
    return ResponseEntity.ok(videoService.upload(request, video, poster));
}
```

#### VideoServiceImpl.java
Updated upload method to:
- Map all required fields (title, description, categories)
- Validate poster file exists and throw exception if missing
- Map optional fields (year, rating, duration, published)

```java
// Save poster image (required)
if (posterFile != null && !posterFile.isEmpty()) {
    video.setPosterUuid(fileStorageService.saveImage(posterFile));
} else {
    throw new IllegalArgumentException("Poster image is required");
}
```

### 3. Postman Collection Updates

#### Updated Video Upload Requests
- Changed "Upload Video with Poster" description to highlight required fields
- Renamed "Upload Video (Minimal)" to "Upload Video (Minimal Required)"
- Updated all descriptions to clearly mark REQUIRED vs OPTIONAL fields
- Added comprehensive field documentation in request descriptions

### 4. Database Schema

The Mermaid diagram shows:
- **USERS table**: User authentication and profile information
- **VIDEOS table**: Video metadata including required fields (title, description, src, poster)
- **VIDEO_CATEGORIES table**: Many-to-many relationship for video genres
- **USER_WATCHLIST table**: Many-to-many relationship between users and videos

Key relationships:
- Users can have multiple videos in watchlist
- Videos can be in multiple users' watchlists
- Videos can have multiple categories

## Required Fields Summary

When uploading a video, the following must be provided:

### Multipart Form Data Parts:
1. **data** (JSON) containing:
   - `title`: String (not blank)
   - `description`: String (not blank, max 4000 chars)
   - `categories`: Array of strings (at least one)

2. **video**: Video file

3. **poster**: Image file (JPG, PNG, etc.)

### Optional Data Fields:
- `year`: Integer
- `rating`: String (e.g., "PG-13", "R")
- `duration`: Integer (in minutes)
- `published`: Boolean (default: false)

## Error Handling

The system will return validation errors if:
- Title is blank or missing
- Description is blank or missing
- Description exceeds 4000 characters
- Categories array is empty or missing
- Video file is not provided
- Poster file is not provided

## Impact on Existing Code

### Breaking Changes:
- Video upload now requires poster file (was optional before)
- Description is now required (was optional before)
- At least one category is now required (was optional before)

### Migration Notes:
If you have existing videos without descriptions or posters, they will remain in the database. However, new uploads must include these fields.

## Testing Checklist

- [ ] Test upload with all required fields
- [ ] Test upload without description (should fail)
- [ ] Test upload without poster (should fail)
- [ ] Test upload without categories (should fail)
- [ ] Test upload with empty description (should fail)
- [ ] Test upload with empty categories array (should fail)
- [ ] Test upload with description > 4000 chars (should fail)
- [ ] Test upload with all required + optional fields
- [ ] Verify validation error messages are clear

## API Endpoint

```
POST /api/videos/upload
Authorization: Bearer {admin_token}
Content-Type: multipart/form-data

Parts:
- data: application/json
- video: video file
- poster: image file
```

## Example Request

Using cURL:
```bash
curl -X POST http://localhost:8080/api/videos/upload \
  -H "Authorization: Bearer {admin_token}" \
  -F 'data={"title":"Movie Title","description":"Full movie description with details","categories":["Action","Drama"]};type=application/json' \
  -F 'video=@/path/to/video.mp4' \
  -F 'poster=@/path/to/poster.jpg'
```

## Example Response

```json
{
  "id": 1,
  "title": "Movie Title",
  "description": "Full movie description with details",
  "year": null,
  "rating": null,
  "duration": null,
  "src": "http://localhost:8080/api/files/video/{uuid}_video.mp4",
  "poster": "http://localhost:8080/api/files/image/{uuid}_poster.jpg",
  "published": false,
  "categories": ["Action", "Drama"],
  "createdAt": "2026-01-16T10:30:00Z",
  "updatedAt": "2026-01-16T10:30:00Z"
}
```

## Documentation Files Updated

1. **Readme.md**
   - Added Database Schema section with Mermaid diagram
   - Updated Video Upload Features section
   - Updated required vs optional fields
   - Updated usage examples
   - Added important notes about requirements

2. **Netflix_Clone_Auth_API.postman_collection.json**
   - Updated "Upload Video with Poster" request
   - Updated "Upload Video (Minimal Required)" request
   - Added comprehensive field documentation

3. **Source Code**
   - VideoRequest.java: Added validation annotations
   - VideoController.java: Added @Valid, made poster required
   - VideoServiceImpl.java: Added validation logic and field mapping

## Validation Messages

- "Title cannot be blank"
- "Description is required"
- "Description cannot be more than 4000 characters"
- "At least one category must be selected"
- "Poster image is required"

These messages will be returned in the API response when validation fails.
