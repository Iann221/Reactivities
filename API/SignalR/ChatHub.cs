using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;
// lecture 213
namespace API.SignalR
{
    public class ChatHub : Hub
    {
        private readonly IMediator _mediator;
        public ChatHub(IMediator mediator)
        {
            _mediator = mediator;
        }

         //method2
        public async Task SendComment(Create.Command command) // pake create comment 
        {
            var comment = await _mediator.Send(command);

            // ini disend setelah command dijalankan (setelah kesave db)
            await Clients.Group(command.ActivityId.ToString()) // Clients.All = all connected clients to hub send to all / Clients.Group = send to group
                .SendAsync("ReceiveComment", comment.Value); //(nama method, yg disend)
        }

        // when a client connects to hub, we want them to join a group
        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var activityId = httpContext.Request.Query["activityId"]; // get the activityId from the query string (link httpnya keknya)
            await Groups.AddToGroupAsync(Context.ConnectionId, activityId); // masukin ke grup activity id
            var result = await _mediator.Send(new List.Query{ActivityId = Guid.Parse(activityId)}); // send list of comments to client
            await Clients.Caller.SendAsync("LoadComments", result.Value); // caller = send to the person making this request connectnya
        }
    }
}