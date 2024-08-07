-- This is designed to be integrated on top of the bazar profile process
local json = require("json")
--[[
    Project Spec
    {
       [domain: string]: {
            [semver/git hash]: {
            -- transaction id or url of the repository
                location: string
            -- transaction id of the project build
                transactionId: string,
                dateCreated: number,
                lastUpdated: number,
            }       
        }
    }
]]
Projects = Projects or {}

ProjectSpecActionMap = ProjectSpecActionMap or {
    -- sets a new domain in the Projects table
    AddProject = "Add-Project",
    -- adds a version to an existing project or creates a project if not exists and updates the records table with the new version
    AddVersion = "Add-Version",
    -- updates a specified version in a specified project
    UpdateVersion = "Update-Version",
    -- removes a version from a specified project
    RemoveVersion = "Remove-Version",
    -- returns a project spec for a given domain
    GetProject = "Get-Project",
    -- returns a list of all projects
    GetAllProjects = "Get-All-Projects",

}


local function camelCase(str)
	-- Remove any leading or trailing spaces
	str = string.gsub(str, "^%s*(.-)%s*$", "%1")

	-- Convert PascalCase to camelCase
	str = string.gsub(str, "^%u", string.lower)

	-- Handle kebab-case, snake_case, and space-separated words
	str = string.gsub(str, "[-_%s](%w)", function(s)
		return string.upper(s)
	end)

	return str
end

local function errorHandler(err)
	return debug.traceback(err)
end

Handlers.remove('Info')
local function createActionHandler(action, msgHandler, position)
	assert(
		type(position) == "string" or type(position) == "nil",
		errorHandler("Position must be a string or nil")
	)
	assert(
		position == nil or position == "add" or position == "prepend" or position == "append",
		"Position must be one of 'add', 'prepend', 'append'"
	)
	return Handlers[position or 'add'](
		camelCase(action),
		Handlers.utils.hasMatchingTag("Action", action),
		function(msg)
			print("Handling Action [" .. msg.Id .. "]: " .. action)
			local handlerStatus, handlerRes = xpcall(function()
				msgHandler(msg)
			end, errorHandler)

			if not handlerStatus then
				ao.send({
					Target = msg.From,
					Action = "Invalid-" .. action .. "-Notice",
					Error = action .. "-Error",
					["Message-Id"] = msg.Id,
					Data = handlerRes,
				})
			end

			return handlerRes
		end
	)
end


createActionHandler(
    ProjectSpecActionMap.AddProject,
    function(msg)
        local data = json.decode(msg.Data)
        local domain = data.Domain
        local version = data.Version
        local location = data.Location
        local transactionId = data.TransactionId
        assert(domain, "Domain is required")
        assert(version, "Version is required")
        assert(location, "Location is required")
        assert(transactionId, "TransactionId is required")

        assert(not Projects[domain], "Project already exists")

        if not Projects[domain] then
            Projects[domain] = {}
        end

        if not Projects[domain][version] then
            Projects[domain][version] = {
                location = location,
                transactionId = transactionId,
                dateCreated = tonumber(msg.Timestamp),
                lastUpdated = tonumber(msg.Timestamp),
            }
        end
    end
)

createActionHandler(
    ProjectSpecActionMap.AddVersion,
    function(msg)
        local data = json.decode(msg.Data)
        local domain = data.Domain
        local version = data.Version
        local location = data.Location
        local transactionId = data.TransactionId
        assert(domain, "Domain is required")
        assert(version, "Version is required")
        assert(location, "Location is required")
        assert(transactionId, "TransactionId is required")
        assert(not Projects[domain][version], "Version already exists")

        if not Projects[domain] then
            Projects[domain] = {
                dateCreated = tonumber(msg.Timestamp),
            }
        end

        if not Projects[domain][version] then
            Projects[domain][version] = {
                location = location,
                transactionId = transactionId,
                lastUpdated = tonumber(msg.Timestamp),
            }


        end
    end
)

createActionHandler(
    ProjectSpecActionMap.UpdateVersion,
    function(msg)
        local data = json.decode(msg.Data)
        local domain = data.Domain
        local version = data.Version
        local location = data.Location
        local transactionId = data.TransactionId
        assert(domain, "Domain is required")
        assert(version, "Version is required")
        assert(location, "Location is required")
        assert(transactionId, "TransactionId is required")
        assert(Projects[domain], "Project does not exist")
        assert(Projects[domain][version], "Version does not exist")

        Projects[domain][version] = {
            location = location,
            transactionId = transactionId,
            lastUpdated = tonumber(msg.Timestamp),
        }
    end
)


createActionHandler(
    ProjectSpecActionMap.RemoveVersion,
    function(msg)
        local data = json.decode(msg.Data)
        local domain = data.Domain
        local version = data.Version
        assert(domain, "Domain is required")
        assert(version, "Version is required")
        assert(Projects[domain], "Project does not exist")
        assert(Projects[domain][version], "Version does not exist")

        Projects[domain][version] = nil
    end
)

createActionHandler(
    ProjectSpecActionMap.GetProject,
    function(msg)
        local data = json.decode(msg.Data)
        local domain = data.Domain
        assert(domain, "Domain is required")
        assert(Projects[domain], "Project does not exist")

        ao.send({
            Target = msg.From,
            Action = "Get-Project-Success",
            ["Message-Id"] = msg.Id,
            Data = json.encode(Projects[domain])
        })
    end
)

createActionHandler(
    ProjectSpecActionMap.GetAllProjects,
    function(msg)
        ao.send({
            Target = msg.From,
            Action = "Get-All-Projects-Success",
            ["Message-Id"] = msg.Id,
            Data = json.encode(Projects)
        })
    end
)

createActionHandler("Info", function(msg)
       ao.send({
            Target = msg.From,
            Action = 'Read-Success',
            Data = json.encode({
                Profile = Profile,
                Assets = Assets,
                Collections = Collections,
                Owner = Owner,
                RegistryId = REGISTRY,
                Roles = Roles,
                Projects = Projects
            })
        })
end, 'prepend')
