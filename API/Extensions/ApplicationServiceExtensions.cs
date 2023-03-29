
using Application.Activities;
using Application.Core;
using Application.Interfaces;
using FluentValidation;
using FluentValidation.AspNetCore;
using Infrastructure.Photos;
using Infrastructure.Security;
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
            // jika ga make fly.io:
            // services.AddDbContext<DataContext>(opt =>
            // {
            //     opt.UseNpgsql(config.GetConnectionString("DefaultConnection"));
            // });

            // jika make fly.io:
            services.AddDbContext<DataContext>(options =>
            {
                var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

                string connStr;

                // Depending on if in development or production, use either FlyIO
                // connection string, or development connection string from env var.
                if (env == "Development")
                {
                    // Use connection string from file.
                    connStr = config.GetConnectionString("DefaultConnection");
                }
                else
                {
                    // Use connection string provided at runtime by FlyIO.
                    var connUrl = Environment.GetEnvironmentVariable("DATABASE_URL");

                    // Parse connection URL to connection string for Npgsql
                    connUrl = connUrl.Replace("postgres://", string.Empty);
                    var pgUserPass = connUrl.Split("@")[0];
                    var pgHostPortDb = connUrl.Split("@")[1];
                    var pgHostPort = pgHostPortDb.Split("/")[0];
                    var pgDb = pgHostPortDb.Split("/")[1];
                    var pgUser = pgUserPass.Split(":")[0];
                    var pgPass = pgUserPass.Split(":")[1];
                    var pgHost = pgHostPort.Split(":")[0];
                    var pgPort = pgHostPort.Split(":")[1];
                    var updatedHost = pgHost.Replace("flycast", "internal");

                    connStr = $"Server={updatedHost};Port={pgPort};User Id={pgUser};Password={pgPass};Database={pgDb};";
                }

                // Whether the connection string came from the local development configuration file
                // or from the environment variable from FlyIO, use it to set up your DbContext.
                options.UseNpgsql(connStr);
            });

            services.AddCors(opt => {
                opt.AddPolicy("CorsPolicy", policy => {
                    policy.AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials() // buat ngilangin error signalr
                    .WithOrigins("http://localhost:3000");
                });
            });
            // buat daftarin api2nya:
            services.AddMediatR(typeof(List.Handler)); // registers mediator as a service. typeof mksdnya kita specify lokasi handlernya
            // for some reason dia cm perlu daftarin yg list aja
            services.AddAutoMapper(typeof(MappingProfiles).Assembly); // registers mapper as a service
            services.AddFluentValidationAutoValidation();
            services.AddValidatorsFromAssemblyContaining<Create>(); // where to look for validator from
            services.AddHttpContextAccessor(); // agar httpcontextaccessor bisa dipake di infrastructure project
            services.AddScoped<IUserAccessor, UserAccessor>(); // bisa make methodnya infrastructure
            services.AddScoped<IPhotoAccessor, PhotoAccessor>();
            services.Configure<CloudinarySettings>(config.GetSection("Cloudinary")); // buat metain dari appsettings.json ke cloudinarySetting
            services.AddSignalR(); 

            return services;
        }
    }
}