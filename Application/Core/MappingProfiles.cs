using System.Security.Cryptography.X509Certificates;
using Application.Activities;
using Application.Comments;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            string currentUsername = null;
            CreateMap<Activity, Activity>(); // from activity dari request to activity dari database;
            CreateMap<Activity, ActivityDto>() // (destination member, option map from(source))
                .ForMember(d => d.HostUsername, o => o.MapFrom(s => s.Attendees
                .FirstOrDefault(x => x.IsHost).AppUser.UserName));
            CreateMap<ActivityAttendee, AttendeeDto>() // mapping activity attendee ke Profile, hrs specific biar ga ketuker ama Profile yg diimport ini
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(d => d.Username, o => o.MapFrom(s => s.AppUser.UserName))
                .ForMember(d => d.Bio, o => o.MapFrom(s => s.AppUser.Bio))
                .ForMember(d => d.Image, o => o.MapFrom(s => s.AppUser.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(d => d.FollowersCount, o => o.MapFrom(s => s.AppUser.Followers.Count))
                .ForMember(d => d.FollowingCount, o => o.MapFrom(s => s.AppUser.Followings.Count)) //hitung jumlah isi collectionnya
                .ForMember(d => d.Following, o => o.MapFrom(s => 
                s.AppUser.Followers.Any(x => x.Observer.UserName == currentUsername))); // cek di list followersnya dia ada kita ga
            CreateMap<AppUser, Profiles.Profile>() // appuser aslinya punya Username, yg g pny cuma Image
                .ForMember(d => d.Image, o => o.MapFrom(s => s.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(d => d.FollowersCount, o => o.MapFrom(s => s.Followers.Count))
                .ForMember(d => d.FollowingCount, o => o.MapFrom(s => s.Followings.Count)) //hitung jumlah isi collectionnya
                .ForMember(d => d.Following, o => o.MapFrom(s => 
                s.Followers.Any(x => x.Observer.UserName == currentUsername))); // cek di list followersnya dia ada kita ga
            CreateMap<Comment, CommentDto>()
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.Author.DisplayName))
                .ForMember(d => d.Username, o => o.MapFrom(s => s.Author.UserName))
                .ForMember(d => d.Image, o => o.MapFrom(s => s.Author.Photos.FirstOrDefault(x => x.IsMain).Url));
        }
    }
}