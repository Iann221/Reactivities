using API.Extensions;
using API.Middleware;
using API.SignalR;
using Application.Activities;
using Application.Core;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers(opt => {
    var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
    opt.Filters.Add(new AuthorizeFilter(policy));
}); // add controller tu agar bisa make controller ex: activitiescontroller
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityService(builder.Configuration);

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>();

app.UseXContentTypeOptions(); //prevents mimesniffing
app.UseReferrerPolicy(opt => opt.NoReferrer()); // untuk nambahin referrer policy
app.UseXXssProtection(opt => opt.EnabledWithBlockMode());
app.UseXfo(opt => opt.Deny()); // prevents app being used inside iframe, prevent clickjacking
app.UseCsp(opt => opt
    .BlockAllMixedContent() // only load https content
    .StyleSources(s => s.Self().CustomSources("https://fonts.googleapis.com")) // any stylesheets as long as it's from our domain are approved
    .FontSources(s => s.Self().CustomSources("https://fonts.gstatic.com", "data:"))
    .FormActions(s => s.Self())
    .FrameAncestors(s => s.Self())
    .ImageSources(s => s.Self().CustomSources("blob:", "https://res.cloudinary.com"))
    .ScriptSources(s => s.Self())
);

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.Use(async (context, next) => {
        context.Response.Headers.Add("Strict-Transport-Security", "max-age=31536000");
        await next.Invoke();
    });
}

app.UseCors("CorsPolicy"); // cross origin resource sharing, bwt wharing sama yg diset di applicationServiceExtension

app.UseAuthentication(); // pastikan sebelum authorization, ditambah klo authenticate token (lect 136)
app.UseAuthorization(); // authorizes a user to access secure resources.

app.UseDefaultFiles(); // look inside wwwroot folder dan use it
app.UseStaticFiles();

app.MapControllers();
app.MapHub<ChatHub>("/chat"); // specify route buat user ketika connect to chathub
app.MapFallbackToController("Index","Fallback"); // krn di fallback controller ada method Index dan nama classnya FallbackController

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

try
{
    var context = services.GetRequiredService<DataContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    await context.Database.MigrateAsync();
    await Seed.SeedData(context, userManager);
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<Logger<Program>>();
    logger.LogError(ex, "an error accured during migration");
}

app.Run();
