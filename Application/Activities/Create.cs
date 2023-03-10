using Application.Core;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest<Result<Unit>> // inget command ga return apa2 tpi gpp specify result of unit
        {
            public Activity Activity { get; set; } // parameternya adlh activity
        }

        public class CommandValidator : AbstractValidator<Command> // x=command
        {
            public CommandValidator()
            {
                // isi rule2nya
                RuleFor(x => x.Activity).SetValidator(new ActivityValidator());
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
        private readonly DataContext _context;
            public Handler(DataContext context)
            {
            _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                _context.Activities.Add(request.Activity); // ini cm nambahin activity ke memori, blm db. makanya g perlu async
                
                var result = await _context.SaveChangesAsync() > 0; // savechangesasync ngereturn integer jml yg kereturn
                if(!result) return Result<Unit>.Failure("failed to create activity");
                
                return Result<Unit>.Success(Unit.Value); // ini basically return nothing. tpi ttp dispecify bwt notify api bhw ini sukses
            }
        }
    }
}