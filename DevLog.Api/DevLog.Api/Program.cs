using DevLog.Api.Application.Handlers;
using DevLog.Api.Application.Interfaces;
using DevLog.Api.Application.Services;
using DevLog.Api.Configurations;
using DevLog.Api.Infrastructure.Data;
using DevLog.Api.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Services

        builder.Services.AddControllers();

        builder.Services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(
    builder.Configuration.GetConnectionString("DefaultConnection")));

        builder.Services.AddIdentity<AppUser, IdentityRole>(options =>
        {
            options.Password.RequiredLength = 6;

            options.User.RequireUniqueEmail = true;
        })
        .AddEntityFrameworkStores<ApplicationDbContext>()
        .AddDefaultTokenProviders();

        builder.Services.AddScoped<IAuthServices, AuthServices>();
        builder.Services.AddScoped<IPostServices, PostServices>();
        builder.Services.AddScoped<IReactionsServices, ReactionsServices>();
        builder.Services.AddScoped<ICommentServices, CommentServices>();
        builder.Services.AddScoped<IProfileServices, ProfileServices>();
        builder.Services.AddScoped<ICloudinaryServices, CloudinaryServices>();
        builder.Services.AddHttpClient<IAIServices, AIServices>();

        builder.Services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ClockSkew = TimeSpan.Zero,
                ValidIssuer = builder.Configuration["Jwt:Issuer"],
                ValidAudience = builder.Configuration["Jwt:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
            };
        });

        builder.Services.AddAuthorization();

        // ✅ FIXED CORS (dev + production)
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend", policy =>
            {
                policy
                    .AllowAnyOrigin() // for now (later restrict to Vercel URL)
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
        });

        builder.Services.AddEndpointsApiExplorer();

        builder.Services.AddSwaggerGen(options =>
        {
            // ❌ removed localhost hardcoding

            options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Name = "Authorization",
                Type = SecuritySchemeType.Http,
                Scheme = "Bearer",
                BearerFormat = "JWT",
                In = ParameterLocation.Header,
                Description = "Enter: Bearer <token>"
            });

            options.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    Array.Empty<string>()
                }
            });
        });

        builder.Services.Configure<CloudinarySettings>(
            builder.Configuration.GetSection("Cloudinary"));

        // Global exception handling
        builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
        builder.Services.AddProblemDetails();

        var app = builder.Build();

        // ✅ CRITICAL: Render port binding
        var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
        app.Urls.Add($"http://0.0.0.0:{port}");

        // Middleware

        app.UseExceptionHandler();

        if (app.Environment.IsDevelopment())
        {
            using var scope = app.Services.CreateScope();
            await IdentitySeed.SeedRolesAndAdmin(scope.ServiceProvider);

            app.UseSwagger();
            app.UseSwaggerUI();
        }

        // ❌ optional (can keep or remove)
        // app.UseHttpsRedirection();

        app.UseCors("AllowFrontend");

        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();

        app.Run();
    }
}