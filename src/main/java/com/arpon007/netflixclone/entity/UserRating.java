package com.arpon007.netflixclone.entity;

// Import necessary annotations and classes
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

/**
 * Entity class representing a User's rating for a Video.
 * This class maps to the "user_ratings" table in the database.
 */
@Entity // Marks this class as a JPA Entity
@Table(name = "user_ratings", uniqueConstraints = {
        // Ensures a user can only rate a specific video once (unique pair of user_id
        // and video_id)
        @UniqueConstraint(columnNames = { "user_id", "video_id" })
})
@Data // Lombok annotation to automatically generate getters, setters, toString,
      // equals, and hashCode methods
public class UserRating {

    @Id // Marks this field as the Primary Key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Strategy to auto-increment the ID
    private Long id; // Unique identifier for the rating record

    // Many-to-One relationship with User entity
    // A user can have multiple ratings, but each rating belongs to one user
    @ManyToOne(fetch = FetchType.LAZY) // Load user data only when accessed (Lazy loading)
    @JoinColumn(name = "user_id", nullable = false) // Foreign key column "user_id", cannot be null
    @JsonIgnore // Prevent serialization of the User object to avoid infinite recursion or
                // sensitive data exposure
    private User user; // The user who submitted the rating

    // Many-to-One relationship with Video entity
    // A video can have multiple ratings, but each rating belongs to one video
    @ManyToOne(fetch = FetchType.LAZY) // Load video data only when accessed
    @JoinColumn(name = "video_id", nullable = false) // Foreign key column "video_id", cannot be null
    @JsonIgnore // Prevent serialization of the Video object
    private Video video; // The video being rated

    @Column(nullable = false) // Column cannot be null
    private Integer rating; // The numeric rating value (e.g., 1-5 stars)

    @CreationTimestamp // Automatically populates with the current timestamp when the entity is first
                       // persisted
    @Column(nullable = false, updatable = false) // Cannot be null, cannot be changed after creation
    private Instant createdAt; // Timestamp of when the rating was created

    @UpdateTimestamp // Automatically updates with the current timestamp whenever the entity is
                     // modified
    @Column(nullable = false) // Cannot be null
    private Instant updatedAt; // Timestamp of the last update to the rating
}
