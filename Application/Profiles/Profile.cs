using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
// ini yang direturn pas user ngeliat detail profile user laen. pasangannya profile.ts
namespace Application.Profiles
{
    public class Profile
    {
        public string Username { get; set; }
        public string DisplayName { get; set; }
        public string Bio { get; set; }
        public string Image { get; set; }
        public bool Following { get; set; } // to know if we follow that user
        public int FollowersCount { get; set; }
        public int FollowingCount { get; set; }
        public ICollection<Photo> Photos { get; set; }
    }
}