using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

namespace Ferrero.GestorDeProjetos.UI.Web
{
    public class GanttErrorMiddleware
    {
        private readonly RequestDelegate _next;

        public GanttErrorMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext httpContext)
        {
            try
            {
                await _next(httpContext);
            }catch(Exception e)
            {
                await HandleExceptionAsync(httpContext, e);
            }
            
        }
        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var result = JsonConvert.SerializeObject(new {
                action = "error"
            });
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            return context.Response.WriteAsync(result);
        }
    }

    // Extension method used to add the middleware to the HTTP request pipeline.
    public static class GanttErrorMiddlewareExtensions
    {
        public static IApplicationBuilder UseGanttErrorMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<GanttErrorMiddleware>();
        }
    }
}