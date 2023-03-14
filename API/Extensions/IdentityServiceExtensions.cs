
using System.Text;
using API.Services;
using Domain;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using Persistence;

namespace API.Extensions
{
    public static class IdentityServiceExtensions
    {
        public static IServiceCollection AddIdentityService(this IServiceCollection services, IConfiguration config) // cek lecture 40 ttg this
        {
            services.AddIdentityCore<AppUser>(opt =>{ // berisi rule2 dari identity
                opt.Password.RequireNonAlphanumeric = false; // passwordnya g perlu ada simbol2 aneh
                opt.User.RequireUniqueEmail = true; // di db harus unik emailnya
            })
            .AddEntityFrameworkStores<DataContext>(); // allows us to query our user in entity framework store (db kita)
        
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"])); 
            //make sure use same key saat bikin token agar api bisa decrypt
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(opt => {
                    opt.TokenValidationParameters = new TokenValidationParameters // specify apa aja yg mw divalidate
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = key,
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                });
            services.AddAuthorization(opt => { // buat make IsHostRequirement
                opt.AddPolicy("IsActivityHost", policy => {
                    policy.Requirements.Add(new IsHostRequirement());
                });
            });
            services.AddTransient<IAuthorizationHandler, IsHostRequirementHandler>();
            services.AddScoped<TokenService>(); // when http request comes in, go to account controller and request token
            
            return services;
        }
    }
}