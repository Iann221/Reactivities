// used when user logs in. berisi data2 yg kita ingin
namespace API.DTO
{
    public class LoginDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}