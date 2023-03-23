using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Activity> Activities { get; set; } // agar bisa ngequery activities dari data context
        public DbSet<ActivityAttendee> ActivityAttendees { get; set; }
        public DbSet<Photo> Photos { get; set; } // in case ingin query our photo directly from data context
        public DbSet<Comment> Comments { get; set; }
        public DbSet<UserFollowing> UserFollowings { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            // configure the primary key
            builder.Entity<ActivityAttendee>(x => x.HasKey(aa => new{aa.AppUserId, aa.ActivityId})); //appuserId dan ActivityId jadi primary key
            // configure the entity
            builder.Entity<ActivityAttendee>()
                .HasOne(u => u.AppUser) //AppUser milik ActivityAttendee
                .WithMany(a => a.Activities) //sambungin sama Activities milik AppUser
                .HasForeignKey(aa => aa.AppUserId);

            builder.Entity<ActivityAttendee>()
                .HasOne(u => u.Activity)
                .WithMany(a => a.Attendees)
                .HasForeignKey(aa => aa.ActivityId);

            // atur comment
            builder.Entity<Comment>()
                .HasOne(a => a.Activity)
                .WithMany(c => c.Comments)
                .OnDelete(DeleteBehavior.Cascade); // jika activity didelete, commentsnya kedelete juga

            // atur relationship UserFollowing
            builder.Entity<UserFollowing>(b => {
                b.HasKey(k => new{k.ObserverId, k.TargetId});

                b.HasOne(o => o.Observer)
                .WithMany(f => f.Followings)
                .HasForeignKey(e => e.ObserverId)
                .OnDelete(DeleteBehavior.Cascade);

                b.HasOne(o => o.Target)
                .WithMany(f => f.Followers)
                .HasForeignKey(e => e.TargetId)
                .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}