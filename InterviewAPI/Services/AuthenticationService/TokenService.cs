using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using InterviewAPI.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;


namespace InterviewAPI.Services.AuthenticationService
{
    public class TokenService
    {
        private readonly UserManager<User> _userManager;

        public TokenService(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        private const int ExpirationMinutes = 30;
        public async Task<string> CreateToken(User user)
        {
            var expiration = DateTime.UtcNow.AddMinutes(ExpirationMinutes);
            var roles = await _userManager.GetRolesAsync(user);

            var token = CreateJwtToken(
                CreateClaims(user, roles),
                CreateSigningCredentials(),
                expiration
            );
            var tokenHandler = new JwtSecurityTokenHandler();
            return tokenHandler.WriteToken(token);
        }

        private JwtSecurityToken CreateJwtToken(List<Claim> claims, SigningCredentials credentials,
            DateTime expiration) =>
            new JwtSecurityToken(
                issuer: "MyIssuer",
                audience: "MyAudience",
                expires: expiration,
                claims: claims,
                signingCredentials: credentials
            );

        private List<Claim> CreateClaims(User user, IList<string> roles)
        {
            try
            {
                var claims = new List<Claim>
                {
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim(ClaimTypes.Name, user.UserName),
                };

                foreach (var role in roles)
                {
                    claims.Add(new Claim(ClaimTypes.Role, role));
                }

                return claims;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }
        private SigningCredentials CreateSigningCredentials()
        {
            return new SigningCredentials(
                new SymmetricSecurityKey(
                    Encoding.ASCII.GetBytes("Mmx44IfURe84A/c4i0g2eY8m/DEhzUzXyyVPwKIo2SU=")
                ),
                SecurityAlgorithms.HmacSha256
            );
        }
    }
}