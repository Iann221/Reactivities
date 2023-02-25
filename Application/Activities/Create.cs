using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest // inget command ga return apa2
        {
            public Activity Activity { get; set; } // parameternya adlh activity
        }

        public class Handler : IRequestHandler<Command>
        {
        private readonly DataContext _context;
            public Handler(DataContext context)
            {
            _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                _context.Activities.Add(request.Activity); // ini cm nambahin activity ke memori, blm db. makanya g perlu async
                await _context.SaveChangesAsync(); 
                return Unit.Value; // ini basically return nothing
            }
        }
    }
}