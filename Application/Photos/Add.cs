using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Add
    {
        public class Command : IRequest<Result<Photo>>
        {
            public IFormFile File { get; set; } // for some reason namanya harus file
        }

        public class Handler : IRequestHandler<Command, Result<Photo>>
        {
        private readonly DataContext _context;
        private readonly IPhotoAccessor _photoAccessor;
        private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IPhotoAccessor photoAccessor, IUserAccessor userAccessor)
            {
            _userAccessor = userAccessor;
            _photoAccessor = photoAccessor;
            _context = context;
            }

            public async Task<Result<Photo>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.Include(p => p.Photos)// include join tablenya
                    .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername()); 
                    // minta objek AppUser yg ada photosnya tapi cm yg make token ini aja

                if(user == null) return null;

                // try to add photo to cloud
                var photoUploadResult = await _photoAccessor.AddPhoto(request.File);// g perlu add exception cenah

                var photo = new Photo
                {
                    Url = photoUploadResult.Url,
                    Id = photoUploadResult.PublicId
                };

                // cek apakah user dah pny foto ato blm, klo blm, jadi main photo
                if(!user.Photos.Any(x => x.IsMain)) photo.IsMain = true;

                user.Photos.Add(photo);
                var result = await _context.SaveChangesAsync() > 0;
                if (result) return Result<Photo>.Success(photo);
                return Result<Photo>.Failure("problem adding photo");
            }
        }
    }
}