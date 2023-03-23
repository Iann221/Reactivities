
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<Result<List<ActivityDto>>> {}

        public class Handler : IRequestHandler<Query, Result<List<ActivityDto>>> // nerima parameter <query, apa yg akan direturn>
        { // returns task of list of activity
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor) // tambah mapper agar bisa ubah activity jadi activityDto
            {
            _userAccessor = userAccessor;
            _mapper = mapper;
            _context = context;
                
            }
            public async Task<Result<List<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                // query ga clean
                // var activities = await _context.Activities
                // .Include(a => a.Attendees) // include join tablenya
                // .ThenInclude(u => u.AppUser) // include usernya
                // .ToListAsync(cancellationToken);

                // var activitiesToReturn = _mapper.Map<List<ActivityDto>>(activities);

                // return Result<List<ActivityDto>>.Success(activitiesToReturn);
                // 

                //query clean
                var activities = await _context.Activities
                .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider, 
                new{currentUsername = _userAccessor.GetUsername()})
                .ToListAsync(cancellationToken);

                // return await _context.Activities.ToListAsync(); // dia yg ngereturn list activitynya ke public class query di atas
                // Activities tu nama tabelnya, context punya.
                return Result<List<ActivityDto>>.Success(activities);
            }
        }
    }
}