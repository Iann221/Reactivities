// ngereturn token
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Domain;
using Microsoft.IdentityModel.Tokens;

namespace API.Services
{
    public class TokenService
    {
        private readonly IConfiguration _config;
        public TokenService(IConfiguration config)
        {
            _config = config;
            
        }
        public string CreateToken(AppUser user)
        { // claim ini buat jadi payload. payload tu bagian dari token
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email),
            };

            // key adlh ketika kita encrypt key ini, the same key is used to decrypt it.
            // key ini hrs disimpan di server
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["TokenKey"])); // biasanya key hrs > 12 karakter
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature); // ngesign si token pake key
            // (key, signature algorithmnya apa)

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(7), // token lasts 7 days
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);    
        }
    }
}