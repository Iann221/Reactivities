
using Application.Activities;
using Application.Core;
using FluentValidation;
using FluentValidation.AspNetCore;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions // extensions baiknya static
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config) // cek lecture 40 ttg this
        {
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();
            services.AddDbContext<DataContext>(opt =>
            {
                opt.UseSqlite(config.GetConnectionString("DefaultConnection"));
            });
            services.AddCors(opt => {
                opt.AddPolicy("CorsPolicy", policy => {
                    policy.AllowAnyMethod().AllowAnyHeader().WithOrigins("http://localhost:3000");
                });
            });
            // buat daftarin api2nya:
            services.AddMediatR(typeof(List.Handler)); // registers mediator as a service. typeof mksdnya kita specify lokasi handlernya
            // for some reason dia cm perlu daftarin yg list aja
            services.AddAutoMapper(typeof(MappingProfiles).Assembly); // registers mapper as a service
            services.AddFluentValidationAutoValidation();
            services.AddValidatorsFromAssemblyContaining<Create>(); // where to look for validator from

            return services;
        }
    }
}