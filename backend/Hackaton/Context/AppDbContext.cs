using Microsoft.EntityFrameworkCore;

namespace Hackaton.Context;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }
}