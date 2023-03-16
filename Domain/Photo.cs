using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
    public class Photo
    {
        public string Id { get; set; } // public id that we get back from cloudinary
        public string Url { get; set; }
        public bool IsMain { get; set; } // is this the user main photo
    }
}