const { loadImage, createCanvas, registerFont } = require('canvas')
const { Client, ChannelType, SlashCommandBuilder, REST, Routes } = require('discord.js')
const { GifUtil, GifFrame, GifCodec } = require('gifwrap')
require('dotenv').config()

registerFont(`${__dirname}/assets/fonts/Montserrat-BoldItalic.ttf`, { family: 'Montserrat BoldItalic' })

// Конфигурация
const token = process.env.DISCORD_TOKEN
const guildId = process.env.GUILD_ID
const adminUserId = process.env.ADMIN_USER_ID

function getOnline(guild) {
    return guild.channels.cache.filter(
        (c) => [ChannelType.GuildVoice, ChannelType.GuildStageVoice].includes(c.type)
    ).reduce((count, v) => {
        // Считаем только пользователей, которые не в DND статусе
        return count + v.members.filter(member => {
            const presence = member.presence
            return !presence || presence.status !== 'dnd'
        }).size
    }, 0)
}

const url = 'https://cdn.discordapp.com/attachments/1370748378949881856/1378018387632062544/LiteGifBanner.gif?ex=683b1321&is=6839c1a1&hm=bdb09ee164782d39a2110085ead51a030f26979ad7ddddf8ee36ce673680dd84&'

async function draw(guild) {
    try {
        // Скачиваем GIF
        const response = await fetch(url)
        const gifBuffer = await response.arrayBuffer()
        
        // Читаем GIF с помощью gifwrap
        const gif = await GifUtil.read(Buffer.from(gifBuffer))
        
        const online = String(getOnline(guild)).split('')
        const finishNumberOneCadrEnd = 133

        // Обрабатываем каждый кадр
        for (let i = 0; i < gif.frames.length; i++) {
            const frame = gif.frames[i]
            
            // Создаем canvas для этого кадра
            const canvas = createCanvas(gif.width, gif.height)
            const ctx = canvas.getContext('2d')
            
            // Рисуем исходный кадр
            const imageData = ctx.createImageData(gif.width, gif.height)
            imageData.data.set(frame.bitmap.data)
            ctx.putImageData(imageData, 0, 0)
            
            // Настройки текста
            ctx.textBaseline = 'middle'
            ctx.textAlign = 'center'
            ctx.font = '100px "Montserrat BoldItalic"'
            ctx.fillStyle = '#a9afea'
            
            // Рисуем текст в зависимости от кадра
            if (i <= 10) {
                for (let j = 0; j < online.length; j++) {
                    ctx.save()
                    const data = ctx.measureText(online[j])

                    let x, y
                    if (online.length % 2 === 0) {
                        if (online.length === 2) {
                            x = (canvas.width / 2) - ((data.width / 2) * (j === 0 ? 1 : -1))
                        } else {
                            x = canvas.width / 2
                        }
                    } else {
                        if (j !== 1 && online.length >= 2) {
                            const center = ctx.measureText(online[1])
                            x = (canvas.width / 2) + Math.round(center.width * (j === 2 ? 1 : -1))
                        } else {
                            x = canvas.width / 2
                        }
                    }

                    if (online.length >= 3) {
                        y = (canvas.height / 2) - (18 - (j === 0 ? 0 : ((1 - (i / 10)) * (4 / (j === 1 ? 2 : 1)))))
                    } else if (online.length === 2) {
                        y = (canvas.height / 2) - (18 - ((1 - (i / 10)) * (4 / (j === 0 ? 2 : 1))))
                    } else {
                        y = (canvas.height / 2) - (18 - ((1 - (i / 10)) * (4 / 2)))
                    }

                    ctx.fillText(online[j], Number(x.toFixed(2)), Number(y.toFixed(2)))
                    ctx.restore()
                }
            } else if (i >= 121) {
                for (let j = 0; j < online.length; j++) {
                    ctx.save()
                    ctx.font = '100px "Montserrat BoldItalic"'
                    ctx.globalAlpha = 1

                    const data = ctx.measureText(online[j])
                    let x, y

                    if (online.length % 2 === 0) {
                        if (online.length === 2) {
                            if (finishNumberOneCadrEnd >= i && j === 0) {
                                ctx.globalAlpha = Number(((i - 121) / (finishNumberOneCadrEnd - 121)).toFixed(2))
                            }
                            x = (canvas.width / 2) - ((data.width / 2) * (j === 0 ? 1 : -1))
                        } else {
                            x = canvas.width / 2
                        }
                    } else {
                        if (j !== 1 && online.length >= 2) {
                            const center = ctx.measureText(online[1])
                            if (finishNumberOneCadrEnd >= i && j === 0) {
                                ctx.globalAlpha = Number(((i - 121) / (finishNumberOneCadrEnd + 7 - 121)).toFixed(2))
                                ctx.font = `${200 - ((i - 121) / (finishNumberOneCadrEnd - 121) * 100)}px Montserrat BoldItalic`
                                x = 93 + ((i - 121) / (finishNumberOneCadrEnd - 121) * (((canvas.width / 2) - center.width) - 93))
                            } else {
                                if (finishNumberOneCadrEnd + 7 >= i && j === 0) {
                                    ctx.globalAlpha = Number(((i - 121) / (finishNumberOneCadrEnd + 7 - 121)).toFixed(2))
                                }
                                x = (canvas.width / 2) + Math.round(center.width * (j === 2 ? 1 : -1))
                            }
                        } else {
                            x = canvas.width / 2
                        }
                    }

                    if (online.length >= 3) {
                        if (finishNumberOneCadrEnd >= i && j === 0) {
                            y = (229 - (((i - 121) / (finishNumberOneCadrEnd - 121)) * (229 - (canvas.height / 2)))) - 18
                        } else {
                            if ((125 > i && j === 1) || (131 > i && j === 2)) {
                                y = null
                            } else if (i >= 125 && j === 1 && 140 > i) {
                                ctx.globalAlpha = Number(((i - 125) / (140 - 125)).toFixed(2))
                                y = 230 - (((i - 125) / (140 - 125)) * (230 - ((canvas.height / 2) - 20)))
                            } else if (i >= 131 && j === 2) {
                                ctx.globalAlpha = Number(((i - 131) / (gif.frames.length - 131)).toFixed(2))
                                y = 209 - (((i - 131) / (gif.frames.length - 131)) * (209 - ((canvas.height / 2) - 18)))
                            } else {
                                y = (canvas.height / 2) - (18 - (j === 0 ? 0 : j === 1 ? 2 : 4))
                            }
                        }
                    } else if (online.length === 2) {
                        if (131 > i && j === 1) {
                            y = null
                        } else if (finishNumberOneCadrEnd + 7 > i && j === 0) {
                            ctx.globalAlpha = Number(((i - 121) / (finishNumberOneCadrEnd + 7 - 121)).toFixed(2))
                            y = 230 - (((i - 121) / (finishNumberOneCadrEnd + 7 - 121)) * (230 - ((canvas.height / 2) - 20)))
                        } else if (i >= 131 && j === 1) {
                            ctx.globalAlpha = Number(((i - 131) / (gif.frames.length - 131)).toFixed(2))
                            y = 209 - (((i - 131) / (gif.frames.length - 131)) * (209 - ((canvas.height / 2) - 18)))
                        } else {
                            y = (canvas.height / 2) - (18 - (j === 0 ? 2 : 4))
                        }
                    } else {
                        if (finishNumberOneCadrEnd >= i && j === 0) {
                            ctx.globalAlpha = Number(((i - 121) / (finishNumberOneCadrEnd - 121)).toFixed(2))
                            y = (229 - (((i - 121) / (finishNumberOneCadrEnd - 121)) * (229 - (canvas.height / 2)))) - 18
                        } else {
                            y = (canvas.height / 2) - (18 - (4 / 2))
                        }
                    }

                    if (y) {
                        ctx.fillText(online[j], Number(x.toFixed(2)), Number(y.toFixed(2)))
                    }
                    ctx.restore()
                }
            }
            
            // Обновляем кадр
            const newImageData = ctx.getImageData(0, 0, gif.width, gif.height)
            frame.bitmap.data.set(newImageData.data)
        }

        // Возвращаем обновленный GIF
        return await GifUtil.write(gif)
    } catch (error) {
        console.error('Ошибка создания GIF баннера:', error)
        return null
    }
}

const client = new Client({ 
    intents: ['Guilds', 'GuildMembers', 'GuildPresences', 'GuildVoiceStates']
})

// Регистрация команды
const commands = [
    new SlashCommandBuilder()
        .setName('banner')
        .setDescription('Установить баннер сервера с онлайн счетчиком')
]

const rest = new REST({ version: '10' }).setToken(token)

client.on('ready', async () => {
    console.log(`${client.user.tag} запущен!`)
    
    // Устанавливаем DND статус для бота
    client.user.setPresence({
        status: 'dnd',
        activities: [{
            name: 'Создание баннеров',
            type: 0
        }]
    })

    try {
        console.log('Регистрация slash команд...')
        await rest.put(
            Routes.applicationGuildCommands(client.user.id, guildId),
            { body: commands }
        )
        console.log('Slash команды зарегистрированы!')
    } catch (error) {
        console.error('Ошибка регистрации команд:', error)
    }
})

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return

    if (interaction.commandName === 'banner') {
        // Проверка админа
        if (interaction.user.id !== adminUserId) {
            return interaction.reply({
                content: 'пошел нахуй не для тебя команда чорт ебаный.',
                ephemeral: true
            })
        }

        // Проверка бустов
        if (interaction.guild.premiumSubscriptionCount === 0) {
            return interaction.reply({
                content: 'у тебя же нету бустов!!! вот купишь тогда я подумаю.',
                ephemeral: true
            })
        }

        await interaction.deferReply({ ephemeral: true })

        try {
            console.log('Создание баннера...')
            const buffer = await draw(interaction.guild)
            
            if (buffer) {
                await interaction.guild.setBanner(buffer)
                await interaction.editReply({
                    content: 'установил баннер на твой сервер'
                })
                console.log('Баннер успешно установлен!')
            } else {
                await interaction.editReply({
                    content: 'Ошибка при создании баннера'
                })
            }
        } catch (error) {
            console.error('Ошибка:', error)
            await interaction.editReply({
                content: 'Произошла ошибка при установке баннера'
            })
        }
    }
})

client.login(token)