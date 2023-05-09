import pygame as pg

# Lesson 1: read the files
# Lesson 2: draw the board and scale the piece

GRID = 100
WIDTH, HEIGHT = 8 * GRID, 8 * GRID
RESOLUTION = WIDTH, HEIGHT

pg.init()
screen = pg.display.set_mode(RESOLUTION)
pieces = pg.image.load('chess_pieces.png').convert(screen)
w, h = pieces.get_size()
w //= 4
h //= 3
black_king = pieces.subsurface((0, 0), (w, h))
black_queen = pieces.subsurface((w, 0), (w, h))
black_bishop = pieces.subsurface((2 * w, 0), (w, h))
black_knight = pieces.subsurface((3 * w, 0), (w, h))
black_rook = pieces.subsurface((2 * w, h), (w, h))
black_pawn = pieces.subsurface((3 * w, h), (w, h))
white_king = pieces.subsurface((0, h), (w, h))
white_queen = pieces.subsurface((w, h), (w, h))
white_bishop = pieces.subsurface((0,  2 * h), (w, h))
white_knight = pieces.subsurface((w, 2 * h), (w, h))
white_rook = pieces.subsurface((2 * w, 2 * h), (w, h))
white_pawn = pieces.subsurface((3 * w, 2 * h), (w, h))
print(black_knight.get_size())


def draw_board(screen):
    for row in range(8):
        for column in range(8):
            color = 'white' if (row + column) % 2 == 0 else 'black'
            coord = row * GRID, column * GRID
            screen.fill(color, pg.Rect(coord, (GRID, GRID)))

while True:
    pg.display.flip()
    draw_board(screen)
    bh = pg.transform.scale(black_king, (GRID, GRID))
    screen.blit(bh, (0.0, 0.0))
