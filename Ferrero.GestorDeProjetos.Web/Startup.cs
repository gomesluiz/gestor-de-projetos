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
using Microsoft.AspNetCore.Mvc.ViewFeatures;

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
            services.AddDefaultIdentity<Usuario>(options =>
            {
                // Password settings
                options.Password.RequireDigit = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireLowercase = false;
                
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
            
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

            services.AddSingleton<ITempDataProvider, CookieTempDataProvider>();
            services.AddSession();
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
            
            app.UseSession();
            app.UseAuthentication();
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
            app.UseCookiePolicy();
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