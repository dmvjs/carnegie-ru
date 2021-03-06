/*global module, require, $*/

var config = require('../config')
    , notify = require('../../util/notify')
    , access = require('../access')
    , header = require('./header')
    , storyList = require('./storyList')
    , doesFileExist = require('../../io/doesFileExist')
    , getFileContents = require('../../io/getFileContents')
    , primary = false;

function friendlyDate (obj) {
  return obj.friendlyPubDate !== undefined ? obj.friendlyPubDate : obj.lastBuildDate;
}

(function init() {
    var arrow = $('<div/>', {
            addClass: 'select-arrow'
        }),
        input = $('<select>', {}
        ).append(
            $('<option/>', {
                val: 'Russian',
                text: 'Pусский',
                selected: true
            })
        ).append(
            $('<option/>', {
                val: 'English',
                text: 'English'
            })
        )
            , checkrow = $('<div/>', {
            addClass: 'checkrow'
        }).append(input).append(arrow),
        menuFragment = $('<section/>', {
            addClass: 'menu'
        }).append(checkrow);

    config.menu.forEach(function (obj) {
        var feed = !!obj.feeds
        , list = $('<ul/>', {
                addClass: 'menu-items ' + (obj.v === 'R' ? 'ru' : 'en')
            })
        , title = $('<span/>', {
                addClass: 'title'
                , text: obj.title || ''
            })
        , sub = $('<span/>', {
                addClass: 'sub'
                , text: obj.sub || ''
            })
        , sectionHeader = $('<div/>', {
                addClass: 'section-header ' + (obj.v === 'R' ? 'ru' : 'en')
                , dir: obj.dir === 'rtl' ? 'rtl' : 'ltr'
            }).append(title).append(sub)
        ;

        if (feed) {
            obj.feeds.forEach(function (el) {
                var label = $('<div/>', {
                    addClass: 'label'
                    , text: el.name
                })
                , sub = $('<div/>', {
                    addClass: 'sub'
                    , text: (obj.v === 'R' ? 'Пока не установлено' : 'Not yet downloaded')
                    , 'data-url': el.filename || el.url.split('/').pop().split('.').shift() + '.json'
                })
                , container = $('<div/>', {
                        addClass: 'menu-item-box'
                    }).append(label).append(sub)
                , box = $('<div/>', {
                        addClass: el.required ? 'check required' : 'check'
                    })
                , link = $('<a/>', {
                    addClass: 'menu-link feed'
                })
                , hairline = $('<div/>', {
                    addClass: 'hairline'
                })
                , item = $('<li/>', {
                    addClass: 'menu-item ' + (el.dir === 'rtl' ? 'rtl' : 'ltr')
                    , dir: el.dir === 'rtl' ? 'rtl' : 'ltr'
                }).append(hairline).append(link.append(container).append(box))
                , filename = access.getFilenameFromFeed(el);

                if (el.required && !primary) {
                    primary = item;
                    item.addClass('active')
                }
                doesFileExist(filename).then(function () {
                    getFileContents(filename).then(function (contents) {
                        var obj = (JSON.parse(contents.target._result));
                        update(filename, friendlyDate(obj));
                        box.addClass('checked');
                    }, function (e){console.log(e)});
                }, function (e){console.log(e)});

                list.append(item);
            })
        } else {
            obj.links.forEach(function (el) {
                var label = $('<div/>', {
                    addClass: 'label link'
                    , text: el.name
                })
                , container = $('<div/>', {
                        addClass: 'menu-item-box'
                    }).append(label)
                , link = $('<a/>', {
                    addClass: 'menu-link link'
                    , href: el.url
                    , target: '_system'
                })
                , hairline = $('<div/>', {
                    addClass: 'hairline'
                })
                , item = $('<li/>', {
                    addClass: 'menu-item ' + (el.dir === 'rtl' ? 'rtl' : 'ltr')
                    , dir: el.dir === 'rtl' ? 'rtl' : 'ltr'
                }).append(hairline).append(link.append(container));

                list.append(item);
            })
        }

        menuFragment.append(sectionHeader).append(list);

    });

    $('section.menu').replaceWith(menuFragment);

    $('section.menu .checkrow select').on('change', function (e) {
        var showEnglish = $(e.currentTarget).val() === 'English';
        $('section.menu').find('.section-header').hide();
        $('section.menu').find('ul.menu-items').hide();
        if (showEnglish) {
            $(document.body).removeClass('russia');
            $('section.menu').find('.section-header.en').show();
            $('section.menu').find('.section-header.en').next().show();
        } else {
            $(document.body).addClass('russia');
            $('section.menu').find('.section-header.ru').show();
            $('section.menu').find('.section-header.ru').next().show();
        }
    }).trigger('change');

    $('a.menu-link .check').on('click', function (e) {
        //download a feed
        var index = $('section.menu li').index($(this).closest('li'));
        e.stopPropagation();

        if ($(this).hasClass('checked') && $(this).hasClass('required') === false) {
            remove(index);
            if (config.track && analytics) {
                analytics.trackEvent('Menu', 'Feed', 'Delete Feed', 10);
            }
        } else {
            if (navigator.connection.type !== 'none') {
                get(index, true, $(this));
                if (config.track && analytics) {
                    analytics.trackEvent('Menu', 'Feed', 'Download Feed', 10);
                }
            } else {
                notify.alert(config.connectionMessage);
            }
        }
    });

    $('a.menu-link.feed').on('click', function (e) {
        var $check = $(e.currentTarget).find('.check')
            , index = $('section.menu li').index($(this).closest('li'));
        e.preventDefault();
        if (navigator.connection.type !== 'none' || $check.hasClass('checked') || $check.hasClass('required')) {
            get(index, false, $(this));
            $('section.menu li.active').removeClass('active');
            $(e.currentTarget).closest('li').addClass('active');
        } else {
            notify.alert(config.connectionMessage);
        }
    });

    $('a.menu-link.link').on('click', function (e) {
        e.preventDefault();
        if (navigator.connection.type !== 'none') {
            var url = $(e.currentTarget).prop('href');
            window.open(encodeURI(url), '_blank', 'location=no,toolbar=yes,enableViewportScale=yes');
            $('section.menu li.active').removeClass('active');
            $(e.currentTarget).closest('li').addClass('active');
            if (config.track && analytics) {
                analytics.trackEvent('Menu', 'Link Click ', url, 10);
            }
        } else {
            notify.alert(config.connectionMessage);
        }
    })

}());

function update(filename, date) {
    var items = $('section.menu .menu-item-box .sub[data-url="' + filename + '"]');
    items.text((items.closest('.menu-items').hasClass('ru') ? 'Обновлено: ' : 'Updated: ') + date);
    items.closest('li').find('.check').removeClass('loading').addClass('checked');
}

function get(id, loadOnly, $el) {
    var filename = access.getFilenameFromId(id);
    $el.closest('li').find('.check').addClass('loading');

    access.get(id, loadOnly).then(function (contents) {
        var obj = (JSON.parse(contents.target._result));

        update(filename, friendlyDate(obj));
        if (!loadOnly) {
            storyList.show(obj).then(function () {
        header.showStoryList();
            });
        }
    }, function (error) {
        var filename = access.getFilenameFromId(id)
            , item = $('section.menu .menu-item-box .sub[data-url="' + filename + '"]').closest('li');

        analytics.trackEvent('Menu', 'Error', 'Feed Load Error: ' + access.getFilenameFromId(id), 10);
        remove(id);
        notify.alert('There was an error processing the ' + access.getFeedNameFromId(id) + ' feed');
    });
}

function cleanup(id) {
    var filename = access.getFilenameFromId(id)
        , item = $('section.menu .menu-item-box .sub[data-url="' + filename + '"]').closest('li');

    item.find('.check').removeClass('checked loading');
    item.find('.sub').text($('.menu-items.ru').is(':visible') ? config.menuMessageRu : config.menuMessage);
    if (item.hasClass('active')) {
        item.removeClass('active');
        primary.addClass('active');
        getFileContents(access.getFilenameFromId(0)).then(function (contents) {
            var obj = (JSON.parse(contents.target._result));
            storyList.show(obj);
        })
    }
}

function remove(id) {

    access.removeFeed(id).then(function () {
        cleanup(id)
    }, function () {
        cleanup(id)
    })
}

$(document).on('access.refresh', function (e, obj, filename) {
  update(filename, friendlyDate(obj));
});

module.exports = {
    update: update
};