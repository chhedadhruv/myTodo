#!/bin/bash
# MyTodo Server Deployment Script

set -e

echo "🚀 MyTodo Server Deployment Script"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    print_warning ".env file not found. Creating from template..."
    if [ -f env.example ]; then
        cp env.example .env
        print_status "Created .env file from template"
        print_warning "Please edit .env file with your configurations before continuing"
        read -p "Press Enter to continue after editing .env file..."
    else
        print_error "env.example file not found. Please create .env file manually."
        exit 1
    fi
fi

# Function to generate secure secret
generate_secret() {
    openssl rand -base64 32 2>/dev/null || cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1
}

# Check if secrets are set to default values
check_secrets() {
    if grep -q "your-super-secret-jwt-key-change-this-in-production" .env; then
        print_warning "JWT_SECRET is set to default value. Generating secure secret..."
        JWT_SECRET=$(generate_secret)
        sed -i.bak "s/your-super-secret-jwt-key-change-this-in-production.*/${JWT_SECRET}/" .env
        print_status "JWT_SECRET updated"
    fi
    
    if grep -q "your-refresh-secret-change-this-in-production" .env; then
        print_warning "JWT_REFRESH_SECRET is set to default value. Generating secure secret..."
        JWT_REFRESH_SECRET=$(generate_secret)
        sed -i.bak "s/your-refresh-secret-change-this-in-production.*/${JWT_REFRESH_SECRET}/" .env
        print_status "JWT_REFRESH_SECRET updated"
    fi
}

# Parse command line arguments
COMMAND=${1:-"deploy"}
PROFILE=${2:-""}

case $COMMAND in
    "deploy")
        print_status "Starting deployment..."
        check_secrets
        
        # Build and start services
        if [ "$PROFILE" = "nginx" ]; then
            print_status "Deploying with Nginx reverse proxy..."
            docker-compose --profile nginx up -d --build
        else
            print_status "Deploying without Nginx..."
            docker-compose up -d --build
        fi
        
        print_status "Deployment completed!"
        print_status "API is available at: http://localhost:5000"
        print_status "Health check: http://localhost:5000/api/health"
        ;;
        
    "stop")
        print_status "Stopping services..."
        docker-compose down
        print_status "Services stopped"
        ;;
        
    "restart")
        print_status "Restarting services..."
        docker-compose restart
        print_status "Services restarted"
        ;;
        
    "logs")
        print_status "Showing logs..."
        docker-compose logs -f
        ;;
        
    "status")
        print_status "Service status:"
        docker-compose ps
        ;;
        
    "clean")
        print_status "Cleaning up..."
        docker-compose down -v --rmi all
        print_status "Cleanup completed"
        ;;
        
    "backup")
        print_status "Creating database backup..."
        timestamp=$(date +%Y%m%d_%H%M%S)
        docker-compose exec postgres pg_dump -U postgres mytodo > "backup_${timestamp}.sql"
        print_status "Database backup created: backup_${timestamp}.sql"
        ;;
        
    "restore")
        if [ -z "$2" ]; then
            print_error "Please provide backup file: ./deploy.sh restore backup_file.sql"
            exit 1
        fi
        print_status "Restoring database from $2..."
        docker-compose exec -T postgres psql -U postgres mytodo < "$2"
        print_status "Database restored"
        ;;
        
    "help")
        echo "Usage: $0 [COMMAND] [OPTIONS]"
        echo ""
        echo "Commands:"
        echo "  deploy [nginx]  - Deploy the application (optionally with nginx)"
        echo "  stop           - Stop all services"
        echo "  restart        - Restart all services"
        echo "  logs           - Show application logs"
        echo "  status         - Show service status"
        echo "  clean          - Clean up all containers and volumes"
        echo "  backup         - Create database backup"
        echo "  restore <file> - Restore database from backup"
        echo "  help           - Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0 deploy        # Deploy without nginx"
        echo "  $0 deploy nginx  # Deploy with nginx reverse proxy"
        echo "  $0 logs          # Show logs"
        echo "  $0 backup        # Create backup"
        ;;
        
    *)
        print_error "Unknown command: $COMMAND"
        echo "Run '$0 help' for usage information"
        exit 1
        ;;
esac 