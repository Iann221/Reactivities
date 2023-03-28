
using Application.Activities;
using Application.Core;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ActivitiesController : BaseAPIController
    {

        [HttpGet] //api/activities, ngesetnya dari nama classnya, klo namanya NaniController, rootnya api/nani
        public async Task<IActionResult> GetActivities([FromQuery]ActivityParams param) 
        {
            return HandlePagedResult(await Mediator.Send(new List.Query{Params = param}));
        }

        // [Authorize] // cuma bisa get activity kalo authenticated dan authorized
        [HttpGet("{id}")] //api/activities/id
        public async Task<IActionResult> GetActivity(Guid id) // iaction allows us to return http responses
        {
            var result = await Mediator.Send(new Details.Query{Id = id});
            return HandleResult(result);
        }

        [HttpPost] // iaction klo g perlu specify tipe yg direturn
        public async Task<IActionResult> CreateActivity([FromBody]Activity activity){
            return HandleResult(await Mediator.Send(new Create.Command{Activity = activity}));
        }

        [Authorize(Policy = "IsActivityHost")]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditActivity(Guid id, Activity activity){ //activity dari body juga jadi keknya bisa tanpa fromBody
            activity.Id = id;
            return HandleResult(await Mediator.Send(new Edit.Command{Activity = activity}));
        }

        [Authorize(Policy = "IsActivityHost")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id){
            return HandleResult(await Mediator.Send(new Delete.Command{Id = id}));
        }

        [HttpPost("{id}/attend")]
        public async Task<IActionResult> Attend(Guid id){
            return HandleResult(await Mediator.Send(new UpdateAttendance.Command{Id = id}));
        }
    }
}