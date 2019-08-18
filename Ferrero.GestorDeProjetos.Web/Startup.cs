using System;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

using Ferrero.GestorDeProjetos.Web.Models.Security;
using Ferrero.GestorDeProjetos.Web.Persistence.Context;

namespace Ferrero.GestorDeProjetos.UI.Web
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            /* 
            services.AddTransient<IAuthorizationHandler, AllowUsersHandler>();
            services.AddTransient<IAuthorizationHandler, AllowPrivateHandler>();
            services.AddAuthorization(opts => {
                opts.AddPolicy("SgPManager", policy => {
                    policy.RequireRole("Manager");
                    policy.RequireClaim("SgP", "Sistema de Gestao de Projetos");
                });
            });
            services.AddAuthorization(opts => {
                opts.AddPolicy("AllowTom", policy => {
                    policy.AddRequirements(new AllowUserPolicy("tom"));
                });
            });
            services.AddAuthorization(opts => {
                opts.AddPolicy("PrivateAccess", policy => {
                    policy.AddRequirements(new AllowPrivatePolicy());
                });
            });
            */
            services.AddDefaultIdentity<Usuario>(options =>
            {
                // Password settings
                options.Password.RequireDigit = false;
                //options.Password.RequiredLength = 8;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireLowercase = false;
                //options.Password.RequiredUniqueChars = 6;
                
                // Lockout settings
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(30);
                options.Lockout.MaxFailedAccessAttempts = 10;
                options.Lockout.AllowedForNewUsers = true;
                
                // User settings
                options.User.RequireUniqueEmail = true; 
            })
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

            /* 
            services.Configure<CookiePolicyOptions>(options =>
            {
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });
            */
            
            //Setting the Account Login page
            services.ConfigureApplicationCookie(options =>
            {
                // Cookie settings
                options.Cookie.HttpOnly = true;
                options.ExpireTimeSpan = TimeSpan.FromMinutes(30);
                options.LoginPath   = "/Conexao/SignIn"; 
                options.LogoutPath  = "/Conexao/SignOut";
                options.AccessDeniedPath    = "/Conexao/SignIn"; 
                options.SlidingExpiration   = true;
            });

            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));
            
            //services.AddDefaultIdentity<Usuario>()
            //    .AddRoles<IdentityRole>() 
            //    .AddEntityFrameworkStores<ApplicationDbContext>();
            //
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, IServiceProvider services)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();
      
            // required for dhtmx.Gantt
            app.UseDefaultFiles();
            app.UseStaticFiles();
            ////////////////////////
            
            app.UseAuthentication();
            app.UseCookiePolicy();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });

            CreateUserRoles(services).Wait();
        }

        private async Task CreateUserRoles(IServiceProvider serviceProvider)
        {
            var RoleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var UserManager = serviceProvider.GetRequiredService<UserManager<Usuario>>();
            
            IdentityResult roleResult;

            //Adding Admin Role
            var roleCheck = await RoleManager.RoleExistsAsync("Admin");
            if (!roleCheck)
            {
                //create the roles and seed them to the database
                roleResult = await RoleManager.CreateAsync(new IdentityRole("Admin"));
            }

            //Adding User Role
            roleCheck = await RoleManager.RoleExistsAsync("User");
            if (!roleCheck)
            {
                //create the roles and seed them to the database
                roleResult = await RoleManager.CreateAsync(new IdentityRole("User"));
            }

            //Assign Admin role to the main User here we have given our newly registered 
            //login id for Admin management
            Usuario usuario = await UserManager.FindByEmailAsync("sgpadmin@ferrero.com");
            if (usuario == null)
            {
                var administrador = new Usuario
                {
                    UserName = "admin",
                    FullName = "Administrador do Sistema",
                    Email    = "sgpadmin@ferrero.com"
                };
                var password  = "@$admin@$";
                var resultado = await UserManager.CreateAsync(administrador, password);
                if (resultado.Succeeded)
                {
                    await UserManager.AddToRoleAsync(administrador, "Admin");
                }
            }
        }
    }
}