using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Photos;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces
{
    public interface IPhotoAccessor
    {
        // method2 ini gakan nyentuh database kita, purely for upload ke cloudinary
        Task<PhotoUploadResult> AddPhoto(IFormFile file); // the file also contains size, name, etc
        Task<string> DeletePhoto(string publicId);
    }
}