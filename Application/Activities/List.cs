
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<List<Activity>> {}

        public class Handler : IRequestHandler<Query, List<Activity>> // nerima parameter <query, apa yg akan direturn>
        { // returns task of list of activity
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
            _context = context;
                
            }
            public async Task<List<Activity>> Handle(Query request, CancellationToken cancellationToken)
            {
                return await _context.Activities.ToListAsync(); // dia yg ngereturn list activitynya ke public class query di atas
                // Activities tu nama tabelnya, context punya.
            }
        }
    }
}